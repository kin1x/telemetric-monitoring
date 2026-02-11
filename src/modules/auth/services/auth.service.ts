import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/modules/logger/logger.service';
import { ForbiddenException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceTokenService } from './service-token.service';
import { ServiceTokenEntity } from '../entities/service-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly tokenSvc: ServiceTokenService,
  ) {
    this.logger.init('AuthService');
    // Логируем загрузку AUTH_SECRET для отладки
    const authSecret = this.config.get<string>('AUTH_SECRET');
    console.log('Loaded AUTH_SECRET:', authSecret);
    if (!authSecret) {
      this.logger.warn('AUTH_SECRET is not defined in configuration');
    }
  }

  public async isValidSecret(secret: string): Promise<boolean> {
    const realSecret: string = this.config.get<string>('AUTH_SECRET') || 'none';
    this.logger.log('Checking secret in isValidSecret:', { provided: secret, expected: realSecret });
    return realSecret === secret;
  }

  public async checkSecret(secret: string): Promise<void> {
    const validSecret = this.config.get<string>('AUTH_SECRET');
    this.logger.log('Checking secret in checkSecret:', { received: secret, expected: validSecret });
    console.log('Received secret:', secret);
    console.log('Expected secret:', validSecret);
    if (!validSecret || secret !== validSecret) {
      throw new HttpException('Invalid secret', HttpStatus.FORBIDDEN);
    }
  }

  public async checkToken(token: string): Promise<void> {
    const realToken: ServiceTokenEntity = await this.tokenSvc.getTokenEntity(token);
    if (!realToken) {
      throw new ForbiddenException('Invalid token');
    }
    if (Date.now() > Number(realToken.expirationDate)) {
      throw new ForbiddenException('Token expired');
    }
  }
}