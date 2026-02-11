import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ServerTimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      map((data) => {
        const end = Date.now();
        const appDuration = end - start;
        const dbDuration = data?.db;

        // Получаем объект ответа
        const response = context.switchToHttp().getResponse();

        // Формируем значение заголовка Server-Timing
        const serverTiming = `miss,${dbDuration ? ` db;dur=${dbDuration},` : ''} app;dur=${appDuration}`;

        if (data?.db) delete data.db;

        // Добавляем заголовок к ответу
        response.setHeader('Server-Timing', serverTiming);

        return data;
      }),
    );
  }
}
