import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GarageController } from '@/adapter/inbound/controller/garage.controller';
import { GarageRepository } from '@/adapter/outbound/garage.repository';
import { VehicleRepository } from '@/adapter/outbound/vehicle.repository';
import { Garage } from '@/domain/entity/garage.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { GarageServiceInPort } from '@/port/inbound/garage-service.in-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { GarageService } from '@/port/service/garage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Garage, Vehicle, Chauffeur])],
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
    {
      provide: VehicleServiceOutPort,
      useClass: VehicleRepository,
    },
  ],
  exports: [GarageServiceInPort, GarageServiceOutPort],
})
export class GarageModule {}
