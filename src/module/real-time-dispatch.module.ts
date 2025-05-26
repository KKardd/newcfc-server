import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RealTimeDispatchController } from '@/adapter/inbound/controller/real-time-dispatch.controller';
import { RealTimeDispatchRepository } from '@/adapter/outbound/real-time-dispatch.repository';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { RealTimeDispatchServiceInPort } from '@/port/inbound/real-time-dispatch-service.in-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { RealTimeDispatchService } from '@/port/service/real-time-dispatch.service';

@Module({
  imports: [TypeOrmModule.forFeature([RealTimeDispatch])],
  controllers: [RealTimeDispatchController],
  providers: [
    {
      provide: RealTimeDispatchServiceInPort,
      useClass: RealTimeDispatchService,
    },
    {
      provide: RealTimeDispatchServiceOutPort,
      useClass: RealTimeDispatchRepository,
    },
  ],
  exports: [RealTimeDispatchServiceInPort, RealTimeDispatchServiceOutPort],
})
export class RealTimeDispatchModule {}
