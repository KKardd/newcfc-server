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
import { AdminModule } from '@/module/admin.module';
import { AuthModule } from '@/module/auth.module';
import { ChauffeurModule } from '@/module/chauffeur.module';
import { DispatchPointModule } from '@/module/dispatch-point.module';
import { ErrorModule } from '@/module/error.module';
import { FileModule } from '@/module/file.module';
import { GarageModule } from '@/module/garage.module';
import { AwsModule } from '@/module/infrastructure/aws.module';
import { NoticeModule } from '@/module/notice.module';
import { OperationModule } from '@/module/operation.module';
import { RealTimeDispatchModule } from '@/module/real-time-dispatch.module';
import { ReservationModule } from '@/module/reservation.module';
import { TokenProviderModule } from '@/module/token-provider.module';
import { VehicleModule } from '@/module/vehicle.module';
import { WayPointModule } from '@/module/way-point.module';
import { WorkHistoryModule } from '@/module/work-history.module';
import { RequestContext } from '@/port/audit/request-context.middleware';
import { FaqModule } from '@/module/faq.module';
import { NotificationHistoryModule } from '@/module/notification-history.module';

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
    TerminusModule,
    AwsModule,
    TokenProviderModule,
    AuthModule,
    ChauffeurModule,
    AdminModule,
    OperationModule,
    DispatchPointModule,
    GarageModule,
    FileModule,
    ErrorModule,
    ReservationModule,
    NoticeModule,
    VehicleModule,
    WayPointModule,
    RealTimeDispatchModule,
    WorkHistoryModule,
    FaqModule,
    NotificationHistoryModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*').apply(RequestContext).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
