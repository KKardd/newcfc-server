import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleController } from '@/adapter/inbound/controller/vehicle.controller';
import { VehicleRepository } from '@/adapter/outbound/vehicle.repository';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { VehicleServiceInPort } from '@/port/inbound/vehicle-service.in-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { VehicleService } from '@/port/service/vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
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
  ],
  exports: [VehicleServiceInPort, VehicleServiceOutPort],
})
export class VehicleModule {}
