import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchReservationDto } from '@/adapter/inbound/dto/request/reservation/search-reservation.dto';
import { ReservationResponseDto } from '@/adapter/inbound/dto/response/reservation/reservation-response.dto';
import { Reservation } from '@/domain/entity/reservation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationServiceOutPort } from '@/port/outbound/reservation-service.out-port';

@Injectable()
export class ReservationRepository implements ReservationServiceOutPort {
  constructor(
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  async findAll(
    searchReservation: SearchReservationDto,
    paginationQuery: PaginationQuery,
  ): Promise<[ReservationResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('reservation')
      .innerJoin('operation', 'operation', 'reservation.operation_id = operation.id')
      .leftJoin('chauffeur', 'chauffeur', 'operation.chauffeur_id = chauffeur.id')
      .leftJoin('vehicle', 'vehicle', 'operation.vehicle_id = vehicle.id')
      .leftJoin('garage', 'garage', 'vehicle.garage_id = garage.id')
      .leftJoin('real_time_dispatch', 'real_time_dispatch', 'operation.real_time_dispatch_id = real_time_dispatch.id')
      .select('reservation.*')
      .addSelect('operation.type', 'operation_type')
      .addSelect('operation.start_time', 'operation_start_time')
      .addSelect('operation.end_time', 'operation_end_time')
      .addSelect('chauffeur.name', 'chauffeur_name')
      .addSelect('chauffeur.phone', 'chauffeur_phone')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('garage.name', 'garage_name')
      .addSelect('real_time_dispatch.name', 'dispatch_origin_name')
      .addSelect('real_time_dispatch.destination_address', 'dispatch_destination_name');

    if (searchReservation.operationId) {
      queryBuilder.andWhere('reservation.operation_id = :operationId', {
        operationId: searchReservation.operationId,
      });
    }

    if (searchReservation.passengerName) {
      queryBuilder.andWhere('reservation.passenger_name LIKE :passengerName', {
        passengerName: `%${searchReservation.passengerName}%`,
      });
    }

    if (searchReservation.passengerPhone) {
      queryBuilder.andWhere('reservation.passenger_phone LIKE :passengerPhone', {
        passengerPhone: `%${searchReservation.passengerPhone}%`,
      });
    }

    if (searchReservation.passengerEmail) {
      queryBuilder.andWhere('reservation.passenger_email LIKE :passengerEmail', {
        passengerEmail: `%${searchReservation.passengerEmail}%`,
      });
    }

    if (searchReservation.passengerCount) {
      queryBuilder.andWhere('reservation.passenger_count = :passengerCount', {
        passengerCount: searchReservation.passengerCount,
      });
    }

    if (searchReservation.status) {
      queryBuilder.andWhere('reservation.status = :status', {
        status: searchReservation.status,
      });
    }

    queryBuilder.orderBy('reservation.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const reservations = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const reservationsResponse: ReservationResponseDto[] = reservations.map((reservation) => ({
      id: reservation.id,
      operationId: reservation.operation_id,
      operationType: reservation.operation_type,
      operationStartTime: reservation.operation_start_time,
      operationEndTime: reservation.operation_end_time,
      chauffeurName: reservation.chauffeur_name,
      chauffeurPhone: reservation.chauffeur_phone,
      vehicleNumber: reservation.vehicle_number,
      vehicleModelName: reservation.vehicle_model_name,
      garageName: reservation.garage_name,
      dispatchOriginName: reservation.dispatch_origin_name,
      dispatchDestinationName: reservation.dispatch_destination_name,
      passengerName: reservation.passenger_name,
      passengerPhone: reservation.passenger_phone,
      passengerEmail: reservation.passenger_email,
      passengerCount: reservation.passenger_count,
      safetyPhone: reservation.safety_phone,
      memo: reservation.memo,
      status: reservation.status,
      createdBy: reservation.created_by,
      createdAt: reservation.created_at,
      updatedBy: reservation.updated_by,
      updatedAt: reservation.updated_at,
    }));

    return [reservationsResponse, totalCount];
  }

  async findById(id: number): Promise<Reservation> {
    return await this.repository.findOneOrFail({ where: { id } });
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
