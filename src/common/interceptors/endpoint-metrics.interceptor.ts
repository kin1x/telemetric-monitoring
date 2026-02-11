import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';
import { EndpointMetricsService } from '../services/endpoint-metrics.service';
import { MetricsService } from '../services/metrics.service';

interface AuthenticatedRequest extends Request {
  user?: { id: string; [key: string]: any };
}

@Injectable()
export class EndpointMetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(EndpointMetricsInterceptor.name);
  private readonly DURATION_THRESHOLD = 2000;
  private readonly REQUESTS_PER_MINUTE_THRESHOLD = 50;

  // Временное хранилище для подсчёта запросов по IP или userId
  private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  constructor(
    private readonly metricsService: EndpointMetricsService,
    private readonly prometheusService: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const response = ctx.getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - startTime) / 1000;
        const userId = request.user?.id;
        const ip = request.ip;
        const method = request.method;
        const path = request.route?.path || request.path;
        const status = response.statusCode;

        this.metricsService.recordRequest(method, path, status, duration, userId, ip);
        this.prometheusService.recordApiRequest(method, path, status, duration);

        // Превышение длительности запроса
        if (duration > this.DURATION_THRESHOLD / 1000) {
          this.logger.warn(
            `Request exceeded threshold: ${duration}s for ${method} ${path}`,
          );
        }

        // Ошибка клиента (4xx)
        if (status >= 400 && status < 500) {
          this.logger.warn(
            `Client error detected: ${status} for ${method} ${path} from IP "${ip || 'unknown'}"`,
          );
        }

        // Ошибка сервера (5xx)
        if (status >= 500) {
          this.logger.error(
            `Server error detected: ${status} for ${method} ${path} from IP "${ip || 'unknown'}"`,
          );
        }

        // Подозрительно частые запросы с одного IP или пользователя
        const requesterId = ip || userId || 'anonymous';
        const now = Date.now();
        const requesterData = this.requestCounts.get(requesterId) || { count: 0, timestamp: now };

        if (now - requesterData.timestamp > 60 * 1000) {
          requesterData.count = 0;
          requesterData.timestamp = now;
        }

        requesterData.count += 1;
        this.requestCounts.set(requesterId, requesterData);

        if (requesterData.count > this.REQUESTS_PER_MINUTE_THRESHOLD) {
          this.logger.warn(
            `Excessive requests detected: ${requesterData.count} requests in last minute from "${requesterId}" for ${method} ${path}`,
          );
        }
      }),
      catchError((err) => {
        const duration = (Date.now() - startTime) / 1000;
        const method = request.method;
        const path = request.route?.path || request.path;
        const ip = request.ip;

        this.prometheusService.recordApiError(method, path, 'unhandled');

        // Ошибка при обработке запроса
        this.logger.error(
          `Unhandled exception occurred: ${err.message} for ${method} ${path} from IP "${ip || 'unknown'}" after ${duration}s`,
        );

        throw err;
      }),
    );
  }

  // Метод для очистки кэша
  clearRequestCounts() {
    this.requestCounts.clear();
  }
}