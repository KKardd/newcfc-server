import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { TransformInterceptor } from '@/adapter/inbound/dto/transform.interceptor';
import { AppModule } from '@/app.module';
import { setSwagger } from '@/config/swagger.config';
import { GLOBAL_PREFIX } from '@/constants';
import { HttpExceptionFilter } from '@/log/http-exception-filter';
import { logging } from '@/log/logging';
import { ErrorModule } from '@/module/error.module';
import { ErrorLogServiceOutPort } from '@/port/outbound/error-log-service.out-port';
import { GlobalValidation } from '@/validate/global-validation-pipe';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logging(),
    abortOnError: true,
  });

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
 // const environment = configService.getOrThrow<string>('common.environment');
 // const nodeEnv = configService.getOrThrow<string>('common.nodeEnv');

  // Set global prefix
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.use(compression());

  // Request Body Size 설정
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: true,
      frameguard: { action: 'deny' },
      xPoweredBy: true,
      xXssProtection: true,
      xContentTypeOptions: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: configService.get<string[]>('common.cors.allowedOrigins'),
  });

  setSwagger(app);

  // Register global pipes, interceptors, filters
  app.useGlobalPipes(
    new GlobalValidation({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  const errorLogRepository = app.select(ErrorModule).get<ErrorLogServiceOutPort>(ErrorLogServiceOutPort, { strict: true });
  app.useGlobalFilters(new HttpExceptionFilter(errorLogRepository));

  // Start the application
  const httpPort = configService.getOrThrow<number>('common.httpPort');
  await app.listen(httpPort);

  logger.log(`ENVIRONMENT: ${environment}`);
  logger.log(`NODE_ENV: ${nodeEnv}`);
  logger.log(`Listening on port ${httpPort}`);
}
bootstrap();
