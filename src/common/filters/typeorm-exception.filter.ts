import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { logRequestHelper } from '../helpers/log-request.helper';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    const responseData = {
      statusCode: 502,
      error: exception.message,
      timestamp: new Date().getTime(),
      path: request.url,
    };
    logRequestHelper(TypeormExceptionFilter.name, request, 502, responseData);
    response.status(502).json(responseData);
  }
}