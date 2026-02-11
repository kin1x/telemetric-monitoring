import { LoggerService } from '../../modules/logger/logger.service';
import { DbMetricsService } from '../services/db-metrics.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram, Counter } from 'prom-client';

export function DbMetrics(entity: string, operation: 'select' | 'insert' | 'update' | 'delete') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logger: LoggerService = this.logger;
      const dbMetricsService: DbMetricsService = this.dbMetricsService;
      const dbQueryTime: Histogram<string> = this.dbQueryTime;
      const dbQueryCounter: Counter<string> = this.dbQueryCounter;

      const start = Date.now();
      const end = dbQueryTime.startTimer();

      try {
        logger.log(`Executing ${operation} on ${entity} in ${propertyKey}`);
        const result = await originalMethod.apply(this, args);
        dbMetricsService.recordQuery(
          `${operation} ${entity}`,
          Date.now() - start,
          entity,
          operation,
          this.userId,
          this.endpoint,
        );
        dbQueryCounter.inc({ entity, operation });
        end({ status: 'success' });
        return result;
      } catch (error) {
        logger.error(`Error in ${propertyKey}: ${error.message}`, error.stack);
        dbQueryCounter.inc({ entity, operation, status: 'error' });
        end({ status: 'error' });
        throw error;
      }
    };

    return descriptor;
  };
}