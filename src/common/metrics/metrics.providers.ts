import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { getCpuUsage, getRamUsage, getNetworkStats, getDiskActivity } from 'node-exporter'; // Предположим, что эта библиотека существует

export const metricsProviders = [
  makeHistogramProvider({
    name: 'api_response_time_seconds',
    help: 'API response time in seconds',
    labelNames: ['method', 'endpoint', 'status'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  }),
  makeCounterProvider({
    name: 'api_requests_total',
    help: 'Total number of API requests',
    labelNames: ['method', 'endpoint'],
  }),
  makeCounterProvider({
    name: 'api_errors_total',
    help: 'Total number of API errors',
    labelNames: ['method', 'endpoint', 'type'],
  }),
  makeCounterProvider({
    name: 'db_queries_total',
    help: 'Total number of database queries',
    labelNames: ['entity', 'operation'],
  }),
  makeHistogramProvider({
    name: 'db_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['entity', 'operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1],
  }),
];

// Метрики для CPU, RAM, сети и дисковой активности требуют внешних инструментов

export class MetricsProvider {
    async getMetrics() {
        try {
            const cpuUsage = await getCpuUsage();
            const ramUsage = await getRamUsage();
            const networkStats = await getNetworkStats();
            const diskActivity = await getDiskActivity();

            return {
                cpuUsage,
                ramUsage,
                networkStats,
                diskActivity
            };
        } catch (error) {
            console.error('Ошибка при сборе метрик:', error);
            throw error;
        }
    }
}