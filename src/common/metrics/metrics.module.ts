// src/common/metrics/metrics.module.ts
import { Module, Global } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { metricsProviders } from './metrics.providers';
import { DbMetricsService } from '../services/db-metrics.service';
import { MetricsService } from '../services/metrics.service';
import { EndpointMetricsService } from '../services/endpoint-metrics.service';
import { DbMetric } from '../../entities/db-metric.entity';
import { EndpointMetric } from '../../entities/endpoint-metric.entity';
import { EndpointMetricsInterceptor } from '../interceptors/endpoint-metrics.interceptor';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics',
    }),
    TypeOrmModule.forFeature([DbMetric, EndpointMetric]), 
  ],
  providers: [
    ...metricsProviders,
    DbMetricsService,
    MetricsService,
    EndpointMetricsService, 
    EndpointMetricsInterceptor,
  ],
  exports: [
    ...metricsProviders,
    DbMetricsService,
    MetricsService,
    EndpointMetricsService, 
    EndpointMetricsInterceptor,
  ],
})
export class MetricsModule {}

export { metricsProviders };