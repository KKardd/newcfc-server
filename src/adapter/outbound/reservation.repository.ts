import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';

@Injectable()
export class ReservationRepository implements ReservationServiceOutPort {
  constructor(
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  async findAll(searchReservation: SearchReservationDto, paginationQuery: PaginationQuery): Promise<[Reservation[], number]> {
    const query = this.repository.createQueryBuilder('reservation');

    if (searchReservation.departureAddress) {
      query.andWhere('reservation.departureAddress LIKE :departureAddress', {
        departureAddress: `%${searchReservation.departureAddress}%`,
      });
    }

    if (searchReservation.destinationAddress) {
      query.andWhere('reservation.destinationAddress LIKE :destinationAddress', {
        destinationAddress: `%${searchReservation.destinationAddress}%`,
      });
    }

    if (searchReservation.departureTime) {
      query.andWhere('reservation.departureTime = :departureTime', {
        departureTime: searchReservation.departureTime,
      });
    }

    if (searchReservation.chauffeurId) {
      query.andWhere('reservation.chauffeurId = :chauffeurId', {
        chauffeurId: searchReservation.chauffeurId,
      });
    }

    if (searchReservation.vehicleId) {
      query.andWhere('reservation.vehicleId = :vehicleId', {
        vehicleId: searchReservation.vehicleId,
      });
    }

    if (searchReservation.reservationStatus) {
      query.andWhere('reservation.reservationStatus = :reservationStatus', {
        reservationStatus: searchReservation.reservationStatus,
      });
    }

    if (searchReservation.status) {
      query.andWhere('reservation.status = :status', {
        status: searchReservation.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
  }

  async findById(id: number): Promise<Reservation | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async save(reservation: Reservation): Promise<void> {
    await this.repository.save(reservation);
  }

  async update(id: number, reservation: Partial<Reservation>): Promise<void> {
    await this.repository.update(id, reservation);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
