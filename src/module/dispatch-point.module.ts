import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DispatchPointController } from '@/adapter/inbound/controller/dispatch-point.controller';
import { DispatchPointRepository } from '@/adapter/outbound/dispatch-point.repository';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DispatchPointServiceInPort } from '@/port/inbound/dispatch-point-service.in-port';
import { DispatchPointServiceOutPort } from '@/port/outbound/dispatch-point-service.out-port';
import { DispatchPointService } from '@/port/service/dispatch-point.service';

@Module({
  imports: [TypeOrmModule.forFeature([DispatchPoint])],
  controllers: [DispatchPointController],
  providers: [
    {
      provide: DispatchPointServiceInPort,
      useClass: DispatchPointService,
    },
    {
      provide: DispatchPointServiceOutPort,
      useClass: DispatchPointRepository,
    },
  ],
  exports: [DispatchPointServiceInPort, DispatchPointServiceOutPort],
})
export class DispatchPointModule {}
