import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
import { Injectable } from '@nestjs/common';
@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.init('HttpExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = Object(exception.getResponse());
    const myResponse = {
      message: exceptionResponse.error || 'Error',
      details: [],
    };
    if (Array.isArray(exceptionResponse?.message)) {
      myResponse.details = exceptionResponse.message;
    } else {
      myResponse.details.push(exceptionResponse.message);
    }
    const responseData = {
      statusCode: status,
      ...myResponse,
      timestamp: new Date().getTime(),
      path: request.url,
    };
    this.logger.error(`HTTP Exception: ${exception.message}`, {
      status,
      url: request.url,
      responseData,
    });
    response.status(status).json(responseData);
  }
}