import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChauffeurController } from '@/adapter/inbound/controller/chauffeur.controller';
import { ChauffeurRepository } from '@/adapter/outbound/chauffeur.repository';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { ChauffeurService } from '@/port/service/chauffeur.service';
import { OperationModule } from './operation.module';
import { ReservationModule } from './reservation.module';
import { WayPointModule } from './way-point.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chauffeur]), OperationModule, ReservationModule, WayPointModule],
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
  ],
  exports: [ChauffeurServiceInPort, ChauffeurServiceOutPort],
})
export class ChauffeurModule {}
