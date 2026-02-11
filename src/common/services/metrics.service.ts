import { Injectable, Logger } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram, Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly DB_DURATION_THRESHOLD = 1; // 1 секунда
  private readonly API_DURATION_THRESHOLD = 2; // 2 секунды
  private readonly API_REQUESTS_PER_MINUTE_THRESHOLD = 100; // Порог запросов к API в минуту
  private readonly DB_QUERIES_PER_MINUTE_THRESHOLD = 50; // Порог запросов к БД в минуту
  private readonly ERROR_RATE_THRESHOLD = 5; // Порог количества ошибок в минуту

  // Временное хранилище для подсчёта частоты запросов и ошибок (в реальном проекте лучше использовать Redis)
  private apiRequestCounts: Map<string, { count: number; timestamp: number }> = new Map();
  private dbQueryCounts: Map<string, { count: number; timestamp: number }> = new Map();
  private errorCounts: Map<string, { count: number; timestamp: number }> = new Map();

  constructor(
    @InjectMetric('api_response_time_seconds')
    private readonly apiResponseTime: Histogram<string>,

    @InjectMetric('api_requests_total')
    private readonly apiRequestsTotal: Counter<string>,

    @InjectMetric('api_errors_total')
    private readonly apiErrorsTotal: Counter<string>,

    @InjectMetric('db_queries_total')
    private readonly dbQueriesTotal: Counter<string>,

    @InjectMetric('db_query_duration_seconds')
    private readonly dbQueryDuration: Histogram<string>,
  ) {}

  recordApiRequest(method: string, endpoint: string, status: number, duration: number) {
    this.apiRequestsTotal.inc({ method, endpoint });
    this.apiResponseTime.observe({ method, endpoint, status: String(status) }, duration);

    // Превышение времени ответа API
    if (duration > this.API_DURATION_THRESHOLD) {
      this.logger.warn(
        `API request exceeded threshold: ${duration}s for ${method} ${endpoint}`,
      );
    }

    // Подозрительно частые запросы к API
    const apiKey = `${method}:${endpoint}`;
    const now = Date.now();
    const apiData = this.apiRequestCounts.get(apiKey) || { count: 0, timestamp: now };

    if (now - apiData.timestamp > 60 * 1000) {
      apiData.count = 0;
      apiData.timestamp = now;
    }

    apiData.count += 1;
    this.apiRequestCounts.set(apiKey, apiData);

    if (apiData.count > this.API_REQUESTS_PER_MINUTE_THRESHOLD) {
      this.logger.warn(
        `Excessive API requests detected: ${apiData.count} requests in last minute for ${method} ${endpoint}`,
      );
    }
  }

  recordApiError(method: string, endpoint: string, type: string) {
    this.apiErrorsTotal.inc({ method, endpoint, type });
    this.logger.error(`API error recorded: ${type} for ${method} ${endpoint}`);

    // Высокий уровень ошибок
    const errorKey = `${method}:${endpoint}:${type}`;
    const now = Date.now();
    const errorData = this.errorCounts.get(errorKey) || { count: 0, timestamp: now };

    if (now - errorData.timestamp > 60 * 1000) {
      errorData.count = 0;
      errorData.timestamp = now;
    }

    errorData.count += 1;
    this.errorCounts.set(errorKey, errorData);

    if (errorData.count > this.ERROR_RATE_THRESHOLD) {
      this.logger.error(
        `High error rate detected: ${errorData.count} ${type} errors in last minute for ${method} ${endpoint}`,
      );
    }
  }

  recordDbQuery(entity: string, operation: string, duration: number) {
    this.dbQueriesTotal.inc({ entity, operation });
    this.dbQueryDuration.observe({ entity, operation }, duration);

    // Превышение времени запроса к БД
    if (duration > this.DB_DURATION_THRESHOLD) {
      this.logger.warn(
        `DB query exceeded threshold: ${duration}s for ${entity} ${operation}`,
      );
    }

    // Подозрительно частые запросы к БД
    const dbKey = `${entity}:${operation}`;
    const now = Date.now();
    const dbData = this.dbQueryCounts.get(dbKey) || { count: 0, timestamp: now };

    if (now - dbData.timestamp > 60 * 1000) {
      dbData.count = 0;
      dbData.timestamp = now;
    }

    dbData.count += 1;
    this.dbQueryCounts.set(dbKey, dbData);

    if (dbData.count > this.DB_QUERIES_PER_MINUTE_THRESHOLD) {
      this.logger.warn(
        `Excessive DB queries detected: ${dbData.count} queries in last minute for ${entity} ${operation}`,
      );
    }
  }

  // Метод для очистки кэша
  clearCounts() {
    this.apiRequestCounts.clear();
    this.dbQueryCounts.clear();
    this.errorCounts.clear();
  }
}