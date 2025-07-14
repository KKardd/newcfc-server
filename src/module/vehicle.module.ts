import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleController } from '@/adapter/inbound/controller/vehicle.controller';
import { VehicleRepository } from '@/adapter/outbound/vehicle.repository';
import { ChauffeurRepository } from '@/adapter/outbound/chauffeur.repository';
import { GarageRepository } from '@/adapter/outbound/garage.repository';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { Garage } from '@/domain/entity/garage.entity';
import { VehicleServiceInPort } from '@/port/inbound/vehicle-service.in-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { VehicleService } from '@/port/service/vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Chauffeur, Garage])],
  controllers: [VehicleController],
  providers: [
    {
      provide: VehicleServiceInPort,
      useClass: VehicleService,
    },
    {
      provide: VehicleServiceOutPort,
      useClass: VehicleRepository,
    },
    {
      provide: ChauffeurServiceOutPort,
      useClass: ChauffeurRepository,
    },
    {
      provide: GarageServiceOutPort,
      useClass: GarageRepository,
    },
  ],
  exports: [VehicleServiceInPort, VehicleServiceOutPort],
})
export class VehicleModule {}
