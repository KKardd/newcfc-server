import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppController } from '@/app.controller';
import commonConfig from '@/config/common.config';
import { TypeOrmConfig } from '@/config/typeorm.config';
import { LoggerMiddleware } from '@/log/logger.middleware';
import { ErrorModule } from '@/module/error.module';
import { FileModule } from '@/module/file.module';
import { AwsModule } from '@/module/infrastructure/aws.module';
import { TokenProviderModule } from '@/module/token-provider.module';
import { RequestContext } from '@/port/audit/request-context.middleware';
import { RefreshToken } from '@/infrastructure/entity/refresh-token.entity';
import { RefreshTokenService } from '@/infrastructure/refresh-token.service';

const typeOrmModules = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => TypeOrmConfig(configService),
    dataSourceFactory: async (options) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return addTransactionalDataSource(new DataSource(options));
    },
    inject: [ConfigService],
  }),
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [commonConfig],
    }),
    ...typeOrmModules,
    AwsModule,
    FileModule,
    TerminusModule,
    TokenProviderModule,
    ErrorModule,

  ],
  controllers: [AppController],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*').apply(RequestContext).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
