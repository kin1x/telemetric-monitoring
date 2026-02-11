import { Injectable } from '@nestjs/common';
import { ServiceTokenRepository } from '../repositories/service-token.repository';
import { CreateTokenDto } from '../dtos/create-token.dto';
import { ServiceTokenEntity } from '../entities/service-token.entity';
import { ServiceTokenResponse } from '../responses/service-token.response';
import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class AuthMapperService {
  private readonly defaultExpirationTime: number;

  constructor(
    private readonly repo: ServiceTokenRepository,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.defaultExpirationTime =
      this.config.get('auth.defaultExpirationTime') || 21600000;
    this.logger.init('AuthMapperService');
  }

  public mapDtoToEntity(dto: CreateTokenDto): ServiceTokenEntity {
    const ormObj = {
      token: dto.token,
      expirationDate: new Date(
        dto?.expirationDate || Date.now() + this.defaultExpirationTime,
      ),
    };
    this.logger.debug('mapDtoToEntity ormObj', ormObj);
    return this.repo.create(ormObj);
  }

  public mapEntityToResponse(entity: ServiceTokenEntity): ServiceTokenResponse {
    return {
      id: entity.id as UuidV4Type,
      token: entity.token,
      expirationDate: entity.expirationDate.getTime(),
    };
  }
}
