import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChauffeurController } from '@/adapter/inbound/controller/chauffeur.controller';
import { ChauffeurRepository } from '@/adapter/outbound/chauffeur.repository';
import { GarageRepository } from '@/adapter/outbound/garage.repository';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Garage } from '@/domain/entity/garage.entity';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { ChauffeurService } from '@/port/service/chauffeur.service';
import { OperationModule } from './operation.module';
import { RealTimeDispatchModule } from './real-time-dispatch.module';
import { ReservationModule } from './reservation.module';
import { ScheduleModule } from './schedule.module';
import { VehicleModule } from './vehicle.module';
import { WayPointModule } from './way-point.module';
import { WorkHistoryModule } from './work-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chauffeur, Vehicle, Garage]),
    forwardRef(() => OperationModule),
    ReservationModule,
    WayPointModule,
    VehicleModule,
    forwardRef(() => RealTimeDispatchModule),
    WorkHistoryModule,
    ScheduleModule,
  ],
  controllers: [ChauffeurController],
  providers: [
    {
      provide: ChauffeurServiceInPort,
      useClass: ChauffeurService,
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
  exports: [ChauffeurServiceInPort, ChauffeurServiceOutPort],
})
export class ChauffeurModule {}
