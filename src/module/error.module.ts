import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorLogController } from '@/adapter/inbound/controller/errorlog.controller';
import { ErrorLogRepository } from '@/adapter/outbound/error-log.repository';
import { ErrorLog } from '@/domain/entity/error-log.entity';
import { ErrorLogServiceInPort } from '@/port/inbound/error-log-service.in-port';
import { ErrorLogServiceOutPort } from '@/port/outbound/error-log-service.out-port';
import { ErrorLogService } from '@/port/service/error-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog])],
  controllers: [ErrorLogController],
  providers: [
    { provide: ErrorLogServiceInPort, useClass: ErrorLogService },
    { provide: ErrorLogServiceOutPort, useClass: ErrorLogRepository },
  ],
  exports: [ErrorLogServiceInPort, ErrorLogServiceOutPort],
})
export class ErrorModule {}
