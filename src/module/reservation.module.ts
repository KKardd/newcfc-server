import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationController } from '@/adapter/inbound/controller/reservation.controller';
import { ReservationRepository } from '@/adapter/outbound/reservation.repository';
import { Reservation } from '@/domain/entity/reservation.entity';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { ReservationService } from '@/port/service/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationController],
  providers: [
    {
      provide: ReservationServiceInPort,
      useClass: ReservationService,
    },
    {
      provide: ReservationServiceOutPort,
      useClass: ReservationRepository,
    },
  ],
  exports: [ReservationServiceInPort, ReservationServiceOutPort],
})
export class ReservationModule {}
