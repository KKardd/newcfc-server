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
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';
import { SafetyPhoneServiceOutPort } from '@/port/outbound/safety-phone-service.out-port';
import {} from '@/validate/serialization';

@Injectable()
export class ReservationService implements ReservationServiceInPort {
  constructor(
    private readonly reservationServiceOutPort: ReservationServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly safetyPhoneServiceOutPort: SafetyPhoneServiceOutPort,
  ) {}

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

    const response = plainToInstance(ReservationResponseDto, reservations);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<ReservationResponseDto> {
    const reservation = await this.reservationServiceOutPort.findById(id);
    return plainToInstance(ReservationResponseDto, reservation);
  }

  async create(createReservation: CreateReservationDto): Promise<void> {
    const reservation = plainToInstance(Reservation, createReservation);

    // 안심 전화번호 생성
    reservation.safetyPhone = await this.generateSafetyPhone(reservation.passengerPhone, reservation.operationId);

    await this.reservationServiceOutPort.save(reservation);
  }

  async update(id: number, updateReservation: UpdateReservationDto): Promise<void> {
    const reservationData = { ...updateReservation } as Partial<Reservation>;

    // 고객 전화번호가 변경된 경우 안심 전화번호 재생성
    if (reservationData.passengerPhone) {
      const existingReservation = await this.reservationServiceOutPort.findById(id);
      if (existingReservation) {
        reservationData.safetyPhone = await this.generateSafetyPhone(
          reservationData.passengerPhone,
          existingReservation.operationId,
        );
      }
    }

    await this.reservationServiceOutPort.update(id, reservationData);
  }

  async delete(id: number): Promise<void> {
    await this.reservationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  private async generateSafetyPhone(passengerPhone: string, operationId: number): Promise<string> {
    try {
      // Operation의 endTime을 가져와서 6시간 후까지 유지되도록 계산
      const operation = await this.operationServiceOutPort.findById(operationId);
      if (!operation || !operation.endTime) {
        // endTime이 없는 경우 기본 24시간으로 설정
        return await this.safetyPhoneServiceOutPort.createVirtualNumberWithAutoExpiry(passengerPhone, 24);
      }

      // endTime에서 6시간 후까지의 시간을 계산
      const endTime = new Date(operation.endTime);
      const expiryTime = new Date(endTime.getTime() + 6 * 60 * 60 * 1000); // 6시간 후
      const now = new Date();

      // 현재 시간부터 만료 시간까지의 시간을 계산 (시간 단위)
      const expireHours = Math.ceil((expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60));

      // 최소 1시간은 보장
      const finalExpireHours = Math.max(expireHours, 1);

      return await this.safetyPhoneServiceOutPort.createVirtualNumberWithAutoExpiry(passengerPhone, finalExpireHours);
    } catch (error) {
      // 안심전화번호 생성 실패 시 원본 전화번호 반환
      return passengerPhone;
    }
  }
}
