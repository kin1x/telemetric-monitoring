import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateTokenDto } from '../dtos/create-token.dto';
import { ServiceTokenResponse } from '../responses/service-token.response';
import { ServiceTokenEntity } from '../entities/service-token.entity';
import { ServiceTokenRepository } from '../repositories/service-token.repository';
import { AuthMapperService } from './auth-mapper.service';
import { DeleteTokenDto } from '../dtos/delete-token.dto';
import { FindAllTokensQueryDto } from '../dtos/find-all-tokens-query.dto'; // Verify the file exists or correct the path
import { IWithCount } from 'src/common/interfaces/with-count.interface';

@Injectable()
export class ServiceTokenService {
  constructor(
    private readonly logger: LoggerService,
    private readonly repo: ServiceTokenRepository,
    private readonly mapper: AuthMapperService,
  ) {
    this.logger.init('ServiceTokenService');
  }

  public async getTokenEntity(token: string): Promise<ServiceTokenEntity> {
    const entity: ServiceTokenEntity | null = await this.repo.findByToken(token);
    if (!entity) {
      throw new NotFoundException('Token not found');
    }
    return entity;
  }

  public async getMany(query: FindAllTokensQueryDto): Promise<IWithCount<ServiceTokenResponse>> {
    const { items, totalCount } = await this.repo.findMany(
      { page: query.page, pageSize: query.limit },
      query.search,
    );
    return {
      items: items.map((item) => this.mapper.mapEntityToResponse(item)),
      totalCount,
    };
  }

  public async createToken(dto: CreateTokenDto): Promise<ServiceTokenResponse> {
    const entity: ServiceTokenEntity = this.mapper.mapDtoToEntity(dto);
    const result: ServiceTokenEntity = await this.repo.save(entity);
    return this.mapper.mapEntityToResponse(result);
  }

  public async deleteToken(dto: DeleteTokenDto): Promise<ServiceTokenResponse> {
    const entity: ServiceTokenEntity = await this.getTokenEntity(dto.token);
    await this.logger.debug('token entity found', entity);
    await this.repo.remove(entity);
    return this.mapper.mapEntityToResponse(entity);
  }
}