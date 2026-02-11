import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { LogRepository } from '../repositories/log.repository';
import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { LogResponse } from '../responses/log.response';
import { LogEntity } from 'src/entities/log.entity';
import { CreateLogDto } from '../dtos/create-log.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { LogTraceRepository } from '../repositories/log-trace.repository';
import { LogMapperService } from './log-mapper.service';
import { IWithCount } from 'src/common/interfaces/with-count.interface';
import { UpdateLogDto } from '../dtos/update-log.dto';
import { DbMetricsService } from 'src/common/services/db-metrics.service';
import { FindManyLogsQueryDto } from '../dtos/find-many-logs-query.dto';
import { IPaginationOptions } from 'src/common/interfaces/pagination-options.interface';

export interface ILogSortOptions<T> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ scope: Scope.REQUEST })
export class LogService {
  public userId?: string;
  public endpoint?: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly logRepo: LogRepository,
    private readonly traceRepo: LogTraceRepository,
    private readonly mapper: LogMapperService,
    private readonly dbMetricsService: DbMetricsService,
    @InjectMetric('api_response_time_seconds')
    private readonly responseTime: Histogram<string>,
    @InjectMetric('api_requests_total')
    private readonly requestCounter: Counter<string>,
    @InjectMetric('api_errors_total')
    private readonly errorCounter: Counter<string>,
    @InjectMetric('db_query_duration_seconds')
    private readonly dbQueryTime: Histogram<string>,
    @InjectMetric('db_queries_total')
    private readonly dbQueryCounter: Counter<string>,
  ) {
    this.logger.init('LogService');
  }

  private async getOneEntity(uuid: UuidV4Type): Promise<LogEntity> {
    const entity = await this.logRepo.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Entity with UUID ${uuid} not found`);
    }
    return entity;
  }

  public async createOne(dto: CreateLogDto): Promise<LogResponse> {
    const end = this.responseTime.startTimer();
    this.requestCounter.inc({ method: 'POST', endpoint: '/logs' });
    try {
      this.logger.log(`Creating log with message: ${dto.message}`);
      const ormObject = this.mapper.mapCreateDtoToEntity(dto);
      const saveResult = await this.logRepo.createOne({
        ...ormObject,
        traces: ormObject.traces.length > 0
          ? await Promise.all(ormObject.traces.map((i) => this.traceRepo.save(i)))
          : [],
      });
      end({ status: 'success' });
      return this.getOne(saveResult.id);
    } catch (error) {
      this.errorCounter.inc({ method: 'POST', endpoint: '/logs', type: error.name });
      end({ status: 'error' });
      throw error;
    }
  }

  public async getOne(uuid: UuidV4Type): Promise<LogResponse> {
    const end = this.responseTime.startTimer();
    this.requestCounter.inc({ method: 'GET', endpoint: '/logs/:uuid' });
    try {
      await this.logger.log(`Fetching log with UUID: ${uuid}`);
      const result = await this.getOneEntity(uuid);
      end({ status: 'success' });
      return this.mapper.mapLogEntityToResponse(result);
    } catch (error) {
      this.errorCounter.inc({ method: 'GET', endpoint: '/logs/:uuid', type: error.name });
      end({ status: 'error' });
      throw error;
    }
  }

  public async getMany(
    paginationOptions: IPaginationOptions,
    sortOptions: ILogSortOptions<'createdAt' | 'order'>,
    query: FindManyLogsQueryDto,
  ): Promise<IWithCount<LogResponse>> {
    const end = this.responseTime.startTimer();
    this.requestCounter.inc({ method: 'GET', endpoint: '/logs' });
    try {
      const start = Date.now();
      const { items, totalCount } = await this.logRepo.findMany(
        { page: query.page, pageSize: query.limit },
        {
          sortBy: sortOptions.sortBy || 'createdAt',
          sortOrder: sortOptions.sortOrder || 'asc',
        },
        query.search,
      );

      await this.dbMetricsService.recordQuery(
        'SELECT logs',
        Date.now() - start,
        'log',
        'select',
        this.userId,
        this.endpoint,
      );

      end({ status: 'success' });
      return {
        items: items.map((i) => this.mapper.mapLogEntityToResponse(i)),
        totalCount,
      };
    } catch (error) {
      this.errorCounter.inc({ method: 'GET', endpoint: '/logs', type: error.name });
      end({ status: 'error' });
      throw error;
    }
  }

  public async updateOne(uuid: UuidV4Type, dto: UpdateLogDto): Promise<LogResponse> {
    const end = this.responseTime.startTimer();
    this.requestCounter.inc({ method: 'PATCH', endpoint: '/logs/:uuid' });
    try {
      const existing = await this.getOneEntity(uuid);
      await this.logRepo.save({
        ...existing,
        ...dto,
        traces: dto?.traces?.length > 0
          ? await Promise.all(dto.traces.map((i) => this.traceRepo.save(this.mapper.mapCreateTraceDtoToEntity(i))))
          : existing.traces,
      });
      end({ status: 'success' });
      return this.getOne(uuid);
    } catch (error) {
      this.errorCounter.inc({ method: 'PATCH', endpoint: '/logs/:uuid', type: error.name });
      end({ status: 'error' });
      throw error;
    }
  }

  public async deleteOne(uuid: UuidV4Type): Promise<LogResponse> {
    const end = this.responseTime.startTimer();
    this.requestCounter.inc({ method: 'DELETE', endpoint: '/logs/:uuid' });
    try {
      const entity = await this.getOneEntity(uuid);
      await this.logRepo.remove(entity);
      end({ status: 'success' });
      return this.mapper.mapLogEntityToResponse(entity);
    } catch (error) {
      this.errorCounter.inc({ method: 'DELETE', endpoint: '/logs/:uuid', type: error.name });
      end({ status: 'error' });
      throw error;
    }
  }
}