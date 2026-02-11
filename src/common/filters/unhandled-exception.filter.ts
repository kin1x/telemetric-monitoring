import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { logRequestHelper } from '../helpers/log-request.helper';

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    const responseData = {
      statusCode: 502,
      error: exception.message,
      timestamp: new Date().getTime(),
      path: request.url,
    };
    logRequestHelper(UnhandledExceptionFilter.name, request, 502, responseData);
    response.status(502).json(responseData);
  }
}