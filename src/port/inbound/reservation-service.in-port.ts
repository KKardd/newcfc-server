import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateReservationDto } from '@/adapter/inbound/dto/request/reservation/create-reservation.dto';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { UpdateReservationDto } from '@/adapter/inbound/dto/request/reservation/update-reservation.dto';
import { ReservationResponseDto } from '@/adapter/inbound/dto/response/reservation/reservation-response.dto';

export abstract class ReservationServiceInPort {
  abstract search(
    searchReservation: SearchReservationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ReservationResponseDto>>;

  abstract detail(id: number): Promise<ReservationResponseDto>;

  abstract create(createReservation: CreateReservationDto): Promise<void>;

  abstract update(id: number, updateReservation: UpdateReservationDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
