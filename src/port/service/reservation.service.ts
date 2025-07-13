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
    const [reservations, totalCount] = await this.reservationServiceOutPort.findAll(
      searchReservation,
      paginationQuery,
      DataStatus.DELETED,
    );
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

    // 안심 전화번호가 없는 경우 고객 전화번호와 동일하게 설정
    if (!reservation.safetyPhone) {
      reservation.safetyPhone = reservation.passengerPhone;
    }

    await this.reservationServiceOutPort.save(reservation);
  }

  async update(id: number, updateReservation: UpdateReservationDto): Promise<void> {
    const reservationData = { ...updateReservation } as Partial<Reservation>;

    // 안심 전화번호가 없고 고객 전화번호가 있는 경우, 안심 전화번호를 고객 전화번호와 동일하게 설정
    if (!reservationData.safetyPhone && reservationData.passengerPhone) {
      reservationData.safetyPhone = reservationData.passengerPhone;
    }

    await this.reservationServiceOutPort.update(id, reservationData);
  }

  async delete(id: number): Promise<void> {
    await this.reservationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
