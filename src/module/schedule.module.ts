import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleController } from '@/adapter/inbound/controller/schedule.controller';
import { ScheduleRepository } from '@/adapter/outbound/schedule.repository';
import { Schedule } from '@/domain/entity/schedule.entity';
import { ScheduleServiceInPort } from '@/port/inbound/schedule-service.in-port';
import { ScheduleServiceOutPort } from '@/port/outbound/schedule-service.out-port';
import { ScheduleService } from '@/port/service/schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [ScheduleController],
  providers: [
    {
      provide: ScheduleServiceInPort,
      useClass: ScheduleService,
    },
    {
      provide: ScheduleServiceOutPort,
      useClass: ScheduleRepository,
    },
  ],
  exports: [ScheduleServiceInPort, ScheduleServiceOutPort],
})
export class ScheduleModule {}
