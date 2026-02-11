import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  Req,
  Inject,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateTokenDto } from '../dtos/create-token.dto';
import { ServiceTokenApiService } from '../services/service-token-api.service';
import { DeleteTokenDto } from '../dtos/delete-token.dto';
import { ServiceTokenResponse } from '../responses/service-token.response';
import { IHttpResponse } from 'src/common/interfaces/http-response.interface';
import { AuthGuard } from '../guards/auth.guard';
import { LoggerService } from 'src/modules/logger/logger.service';
import { CatchErrors } from 'src/common/decorators/catch-errors.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly tokenSvc: ServiceTokenApiService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.logger.init('AuthController');
  }

  @Post('token')
  @HttpCode(HttpStatus.CREATED)
  @CatchErrors()
  public async createToken(
    @Body() dto: CreateTokenDto,
    @Req() req: any,
  ): Promise<IHttpResponse<ServiceTokenResponse>> {
    this.logger.log('Client IP:', req.ip);
    this.logger.log('Raw request body:', req.body);
    this.logger.log('Parsed DTO:', dto);
    const item: ServiceTokenResponse = await this.tokenSvc.createToken(dto);
    return {
      message: 'Token created',
      item,
    };
  }

  @Delete('token')
  @HttpCode(HttpStatus.OK)
  public async deleteToken(
    @Body() dto: DeleteTokenDto,
  ): Promise<IHttpResponse<ServiceTokenResponse>> {
    const item: ServiceTokenResponse = await this.tokenSvc.deleteToken(dto);
    return {
      message: 'Token deleted',
      item,
    };
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async testAccess() {
    return {
      message: 'Access granted',
    };
  }
}