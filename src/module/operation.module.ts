import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperationController } from '@/adapter/inbound/controller/operation.controller';
import { OperationRepository } from '@/adapter/outbound/operation.repository';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { Garage } from '@/domain/entity/garage.entity';
import { Operation } from '@/domain/entity/operation.entity';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { Reservation } from '@/domain/entity/reservation.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { GarageModule } from '@/module/garage.module';
import { NotificationModule } from '@/module/infrastructure/notification.module';
import { VehicleModule } from '@/module/vehicle.module';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { OperationService } from '@/port/service/operation.service';

import { AdminModule } from './admin.module';
import { ChauffeurModule } from './chauffeur.module';
import { RealTimeDispatchModule } from './real-time-dispatch.module';
import { ReservationModule } from './reservation.module';
import { ScheduleModule } from './schedule.module';
import { WayPointModule } from './way-point.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation, WayPoint, Vehicle, Chauffeur, Garage, RealTimeDispatch, Reservation]),
    forwardRef(() => AdminModule),
    forwardRef(() => ChauffeurModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => ReservationModule),
    forwardRef(() => WayPointModule),
    forwardRef(() => RealTimeDispatchModule),
    forwardRef(() => GarageModule),
    forwardRef(() => NotificationModule),
    ScheduleModule,
  ],
  controllers: [OperationController],
  providers: [
    {
      provide: OperationServiceInPort,
      useClass: OperationService,
    },
    {
      provide: OperationServiceOutPort,
      useClass: OperationRepository,
    },
  ],
  exports: [OperationServiceInPort, OperationServiceOutPort],
})
export class OperationModule {}
