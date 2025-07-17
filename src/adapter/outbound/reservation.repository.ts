import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';

@Injectable()
export class ReservationRepository implements ReservationServiceOutPort {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(
    search: SearchReservationDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[Reservation[], number]> {
    const where: any = {};
    if (search.operationId) where.operationId = search.operationId;
    if (search.passengerName) where.passengerName = Like(`%${search.passengerName}%`);
    if (search.passengerPhone) where.passengerPhone = Like(`%${search.passengerPhone}%`);
    if (search.passengerEmail) where.passengerEmail = Like(`%${search.passengerEmail}%`);
    if (search.passengerCount) where.passengerCount = search.passengerCount;
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.reservationRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findOne({ where: { id } });
  }

  async findByOperationId(operationId: number): Promise<Reservation | null> {
    return this.reservationRepository.findOne({ where: { operationId } });
  }

  async save(reservation: Reservation): Promise<Reservation> {
    return this.reservationRepository.save(reservation);
  }

  async update(id: number, reservation: Partial<Reservation>) {
    return this.reservationRepository.update(id, reservation);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.reservationRepository.update(id, { status });
  }
}
