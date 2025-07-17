import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class ReservationServiceOutPort {
  abstract findAll(
    searchReservation: SearchReservationDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[Reservation[], number]>;

  abstract findById(id: number): Promise<Reservation | null>;

  abstract findByOperationId(operationId: number): Promise<Reservation | null>;

  abstract save(reservation: Reservation): Promise<Reservation>;

  abstract update(id: number, reservation: Partial<Reservation>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
