import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndpointMetric } from '../../entities/endpoint-metric.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class EndpointMetricsService {
  private readonly logger = new Logger(EndpointMetricsService.name);
  private readonly DURATION_THRESHOLD = 2000;
  private readonly REQUESTS_PER_MINUTE_THRESHOLD = 50;
  private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  constructor(
    @InjectRepository(EndpointMetric)
    private readonly endpointMetricsRepo: Repository<EndpointMetric>,
    @InjectMetric('api_requests_total')
    private readonly requestCounter: Counter<string>,
    @InjectMetric('api_response_time_seconds')
    private readonly responseTime: Histogram<string>,
    @InjectMetric('api_errors_total')
    private readonly errorCounter: Counter<string>,
  ) {}

  async recordRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string,
  ) {
    const end = this.responseTime.startTimer({ method, endpoint: path });
    this.requestCounter.inc({ method, endpoint: path });

    await this.endpointMetricsRepo.save({
      method,
      path,
      statusCode,
      duration,
      userId,
      ip,
    });

    if (duration > this.DURATION_THRESHOLD) {
      this.logger.warn(`Endpoint request exceeded threshold: ${duration}ms for ${method} ${path}`);
    }

    if (statusCode >= 500) {
      this.logger.error(`Server error detected: ${statusCode} for ${method} ${path}`);
      this.errorCounter.inc({ method, endpoint: path, type: 'server_error' });
    }

    if (statusCode >= 400 && statusCode < 500) {
      this.logger.warn(`Client error detected: ${statusCode} for ${method} ${path} from IP "${ip || 'unknown'}"`);
      this.errorCounter.inc({ method, endpoint: path, type: 'client_error' });
      if (path.includes('/auth') || path.includes('/login')) {
        this.logger.warn(`Potential suspicious activity detected: ${statusCode} for ${method} ${path} from IP "${ip || 'unknown'}"`);
      }
    }

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
      this.logger.warn(`Excessive requests detected: ${requesterData.count} requests in last minute from "${requesterId}" for ${method} ${path}`);
      this.requestCounts.set(requesterId, { count: 0, timestamp: now });
      this.logger.warn(`Blocking requester: "${requesterId}" due to excessive requests.`);
    }

    end({ status: statusCode.toString() });
  }

  clearRequestCounts() {
    this.requestCounts.clear();
  }
}