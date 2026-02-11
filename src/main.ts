import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { corsOptionsOrigin } from './config/cors';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TypeormExceptionFilter } from './common/filters/typeorm-exception.filter';
import { UnhandledExceptionFilter } from './common/filters/unhandled-exception.filter';
import { LoggerService } from './modules/logger/logger.service';
import { EndpointMetricsInterceptor } from './common/interceptors/endpoint-metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.APP_PORT;

  app.enableCors({
    origin: corsOptionsOrigin,
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'healthcheck', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const endpointMetricsInterceptor = app.get(EndpointMetricsInterceptor);
  app.useGlobalInterceptors(endpointMetricsInterceptor);

  app.useGlobalFilters(new UnhandledExceptionFilter());
  app.useGlobalFilters(new TypeormExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter(await app.resolve(LoggerService))); 

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      disableErrorMessages: false,
      stopAtFirstError: false,
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
    }),
  );

  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();