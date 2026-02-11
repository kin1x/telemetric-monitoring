import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceTokenEntity } from '../entities/service-token.entity';
import { IPaginationOptions } from 'src/common/interfaces/pagination-options.interface';
import { IWithCount } from 'src/common/interfaces/with-count.interface';

@Injectable()
export class ServiceTokenRepository extends Repository<ServiceTokenEntity> {
  constructor(
    @InjectRepository(ServiceTokenEntity)
    protected repository: Repository<ServiceTokenEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findByToken(token: string): Promise<ServiceTokenEntity | null> {
    const entity: ServiceTokenEntity | null = await this.findOne({
      where: {
        token: token || 'none',
      },
    });
    return entity;
  }

  public async findMany(
    paginationOptions: IPaginationOptions,
    search?: string,
  ): Promise<IWithCount<ServiceTokenEntity>> {
    const qb = this.repository.createQueryBuilder('token');

    // Добавляем поиск по полю token
    if (search) {
      qb.where('token.token LIKE :search', { search: `%${search}%` });
    }

    // Применяем пагинацию
    qb.take(paginationOptions.pageSize).skip(
      paginationOptions.pageSize * paginationOptions.page,
    );

    const [items, totalCount] = await qb.getManyAndCount();
    return {
      items,
      totalCount,
    };
  }
}