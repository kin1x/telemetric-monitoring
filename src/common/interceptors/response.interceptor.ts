import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { logRequestHelper } from '../helpers/log-request.helper';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        logRequestHelper(
          ResponseInterceptor.name,
          request,
          response.statusCode,
          data,
        );
        return {
          statusCode: response.statusCode,
          ...data,
          timestamp: new Date().getTime(),
          path: request.url,
          version: this.configService.get('version'),
        };
      }),
    );
  }
}
