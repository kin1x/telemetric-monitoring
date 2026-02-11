import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { EMPTY_UUID } from 'src/common/constants/empty-uuid';
import { IPaginationOptions } from 'src/common/interfaces/pagination-options.interface';
import { ISortOptions } from 'src/common/interfaces/sort-options.interface';
import { IWithCount } from 'src/common/interfaces/with-count.interface';
import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { LogEntity } from 'src/entities/log.entity';
import { DeepPartial, Repository } from 'typeorm';
import { DbMetricsService } from 'src/common/services/db-metrics.service';
import { DbMetrics } from 'src/common/decorators/db-metrics.decorator';

export interface ILocalSortOptions<T> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class LogRepository extends Repository<LogEntity> {
  constructor(
    @InjectRepository(LogEntity)
    protected repository: Repository<LogEntity>,
    private readonly dbMetricsService: DbMetricsService,
    @InjectMetric('db_query_duration_seconds')
    private readonly dbQueryTime: Histogram<string>,
    @InjectMetric('db_queries_total')
    private readonly dbQueryCounter: Counter<string>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  @DbMetrics('Log', 'select')
  public async findByUuid(uuid: UuidV4Type): Promise<LogEntity | null> {
    if (!uuid || uuid === EMPTY_UUID) {
      return null;
    }
    return this.repository.findOne({
      where: { id: uuid },
      relations: { traces: true },
    });
  }

  @DbMetrics('Log', 'select')
  public async findMany(
    paginationOptions: IPaginationOptions,
    sortOptions: ILocalSortOptions<'createdAt' | 'order'>,
    search?: string, // Новый параметр поиска
  ): Promise<IWithCount<LogEntity>> {
    const qb = this.repository.createQueryBuilder('log');

    // Добавляем поиск по полю message
    if (search) {
      qb.where('log.message LIKE :search', { search: `%${search}%` });
    }

    // Применяем пагинацию и сортировку
    qb.take(paginationOptions.pageSize)
      .skip(paginationOptions.pageSize * paginationOptions.page)
      .orderBy(
        sortOptions?.sortBy ? `log.${sortOptions.sortBy}` : undefined,
        sortOptions?.sortOrder === 'asc' ? 'ASC' : sortOptions?.sortOrder === 'desc' ? 'DESC' : undefined,
      );

    const [items, totalCount] = await qb.getManyAndCount();
    return {
      items,
      totalCount,
    };
  }

  @DbMetrics('Log', 'select')
  public async getMaxOrder(): Promise<number> {
    const qb = this.repository.createQueryBuilder('log');
    qb.select('MAX(log.order)', 'max');
    const { max } = await qb.getRawOne();
    return max ? max : 0;
  }

  @DbMetrics('Log', 'insert')
  public async createOne(entityLike: DeepPartial<LogEntity>): Promise<LogEntity> {
    let order: number = entityLike.order;
    if (!order) {
      const maxOrder: number = await this.getMaxOrder();
      order = maxOrder + 1;
    }

    const newEntity = this.repository.create({
      ...entityLike,
      order,
    });

    return await this.repository.save(newEntity);
  }

  @DbMetrics('Log', 'update')
  public async saveEntity(entity: DeepPartial<LogEntity>): Promise<LogEntity> {
    return this.repository.save(entity);
  }

  @DbMetrics('Log', 'delete')
  public async saveremove(entity: LogEntity): Promise<void> {
    await this.repository.remove(entity);
  }
}