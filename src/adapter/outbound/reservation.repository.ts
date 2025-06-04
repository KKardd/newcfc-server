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

    if (searchReservation.operationId) {
      query.andWhere('reservation.operationId = :operationId', {
        operationId: searchReservation.operationId,
      });
    }

    if (searchReservation.passengerName) {
      query.andWhere('reservation.passengerName LIKE :passengerName', {
        passengerName: `%${searchReservation.passengerName}%`,
      });
    }

    if (searchReservation.passengerPhone) {
      query.andWhere('reservation.passengerPhone LIKE :passengerPhone', {
        passengerPhone: `%${searchReservation.passengerPhone}%`,
      });
    }

    if (searchReservation.passengerEmail) {
      query.andWhere('reservation.passengerEmail LIKE :passengerEmail', {
        passengerEmail: `%${searchReservation.passengerEmail}%`,
      });
    }

    if (searchReservation.passengerCount) {
      query.andWhere('reservation.passengerCount = :passengerCount', {
        passengerCount: searchReservation.passengerCount,
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
