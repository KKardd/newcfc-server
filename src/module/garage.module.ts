import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GarageController } from '@/adapter/inbound/controller/garage.controller';
import { GarageRepository } from '@/adapter/outbound/garage.repository';
import { Garage } from '@/domain/entity/garage.entity';
import { GarageServiceInPort } from '@/port/inbound/garage-service.in-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { GarageService } from '@/port/service/garage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Garage])],
  controllers: [GarageController],
  providers: [
    {
      provide: GarageServiceInPort,
      useClass: GarageService,
    },
    {
      provide: GarageServiceOutPort,
      useClass: GarageRepository,
    },
  ],
  exports: [GarageServiceInPort, GarageServiceOutPort],
})
export class GarageModule {}
