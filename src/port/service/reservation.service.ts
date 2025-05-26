import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateReservationDto } from '@/adapter/inbound/dto/request/reservation/create-reservation.dto';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { UpdateReservationDto } from '@/adapter/inbound/dto/request/reservation/update-reservation.dto';
import { ReservationResponseDto } from '@/adapter/inbound/dto/response/reservation/reservation-response.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class ReservationService implements ReservationServiceInPort {
  constructor(private readonly reservationServiceOutPort: ReservationServiceOutPort) {}

  async search(
    searchReservation: SearchReservationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ReservationResponseDto>> {
    const [reservations, totalCount] = await this.reservationServiceOutPort.findAll(searchReservation, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(ReservationResponseDto, reservations, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<ReservationResponseDto> {
    const reservation = await this.reservationServiceOutPort.findById(id);
    return plainToInstance(ReservationResponseDto, reservation, classTransformDefaultOptions);
  }

  async create(createReservation: CreateReservationDto): Promise<void> {
    const reservation = plainToInstance(Reservation, createReservation);
    await this.reservationServiceOutPort.save(reservation);
  }

  async update(id: number, updateReservation: UpdateReservationDto): Promise<void> {
    await this.reservationServiceOutPort.update(id, updateReservation as Partial<Reservation>);
  }

  async delete(id: number): Promise<void> {
    await this.reservationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
