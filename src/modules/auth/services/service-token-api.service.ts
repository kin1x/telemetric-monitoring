import { LoggerService } from 'src/modules/logger/logger.service';
import { CreateTokenDto } from '../dtos/create-token.dto';
import { ServiceTokenResponse } from '../responses/service-token.response';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ServiceTokenService } from './service-token.service';
import { DeleteTokenDto } from '../dtos/delete-token.dto';

@Injectable()
export class ServiceTokenApiService {
  constructor(
    private readonly logger: LoggerService,
    private readonly authSvc: AuthService,
    private readonly tokenSvc: ServiceTokenService,
  ) {
    this.logger.init('ServiceTokenApiService');
  }

  public async createToken(dto: CreateTokenDto): Promise<ServiceTokenResponse> {
    this.logger.log('Received DTO:', dto);
    try {
      await this.authSvc.checkSecret(dto.secret);
      const result: ServiceTokenResponse = await this.tokenSvc.createToken(dto);
      this.logger.log('Created token:', result);
      return result;
    } catch (error) {
      this.logger.error('Error creating token:', error);
      throw error;
    }
  }

  public async deleteToken(dto: DeleteTokenDto): Promise<ServiceTokenResponse> {
    await this.authSvc.checkSecret(dto.secret);
    const result: ServiceTokenResponse = await this.tokenSvc.deleteToken(dto);
    this.logger.log('Deleted token:', result);
    return result;
  }
}