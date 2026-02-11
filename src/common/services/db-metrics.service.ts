import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbMetric } from '../../entities/db-metric.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Counter, Histogram } from 'prom-client';

@Injectable()
export class DbMetricsService {
  private readonly logger = new Logger(DbMetricsService.name);

  constructor(
    @InjectRepository(DbMetric)
    private readonly dbMetricsRepo: Repository<DbMetric>,
    @InjectMetric('db_queries_total')
    private readonly dbQueryCounter: Counter<string>,
    @InjectMetric('db_query_duration_seconds')
    private readonly dbQueryTime: Histogram<string>,
  ) {}

  async recordQuery(
    query: string,
    duration: number,
    entity: string,
    operation: string,
    userId?: string,
    endpoint?: string,
  ) {
    const durationSeconds = duration / 1000;
    this.dbQueryCounter.inc({ entity, operation });
    this.dbQueryTime.observe({ entity, operation }, durationSeconds);

    await this.dbMetricsRepo.save({
      query,
      duration: durationSeconds,
      entity,
      operation,
      userId,
      endpoint,
    });

    if (durationSeconds > 1) {
      this.logger.warn(`DB query exceeded threshold: ${durationSeconds}s for ${entity} ${operation}`);
    }
  }
}