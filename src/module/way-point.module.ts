import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WayPointController } from '@/adapter/inbound/controller/way-point.controller';
import { WayPointRepository } from '@/adapter/outbound/way-point.repository';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';
import { WayPointService } from '@/port/service/way-point.service';

@Module({
  imports: [TypeOrmModule.forFeature([WayPoint])],
  controllers: [WayPointController],
  providers: [
    {
      provide: WayPointServiceInPort,
      useClass: WayPointService,
    },
    {
      provide: WayPointServiceOutPort,
      useClass: WayPointRepository,
    },
  ],
  exports: [WayPointServiceInPort, WayPointServiceOutPort],
})
export class WayPointModule {}
