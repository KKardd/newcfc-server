import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkHistoryController } from '@/adapter/inbound/controller/work-history.controller';
import { WorkHistoryRepository } from '@/adapter/outbound/work-history.repository';
import { VehicleRepository } from '@/adapter/outbound/vehicle.repository';
import { ChauffeurRepository } from '@/adapter/outbound/chauffeur.repository';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { WorkHistoryService } from '@/port/service/work-history.service';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';

@Module({
  imports: [TypeOrmModule.forFeature([WorkHistory, Vehicle, Chauffeur])],
  controllers: [WorkHistoryController],
  providers: [
    WorkHistoryService,
    WorkHistoryRepository,
    {
      provide: VehicleServiceOutPort,
      useClass: VehicleRepository,
    },
    {
      provide: ChauffeurServiceOutPort,
      useClass: ChauffeurRepository,
    },
  ],
  exports: [WorkHistoryService],
})
export class WorkHistoryModule {}
