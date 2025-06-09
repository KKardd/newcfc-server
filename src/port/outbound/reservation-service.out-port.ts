import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { ReservationResponseDto } from '@/adapter/inbound/dto/response/reservation/reservation-response.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class ReservationServiceOutPort {
  abstract findAll(
    searchReservation: SearchReservationDto,
    paginationQuery: PaginationQuery,
  ): Promise<[ReservationResponseDto[], number]>;

  abstract findById(id: number): Promise<Reservation>;

  abstract save(reservation: Reservation): Promise<void>;

  abstract update(id: number, reservation: Partial<Reservation>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
