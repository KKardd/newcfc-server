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
      .addSelect('operation.id', 'operation_id')
      .addSelect('operation.type', 'operation_type')
      .addSelect('operation.is_repeated', 'operation_is_repeated')
      .addSelect('operation.start_time', 'operation_start_time')
      .addSelect('operation.end_time', 'operation_end_time')
      .addSelect('operation.distance', 'operation_distance')
      .addSelect('operation.chauffeur_id', 'operation_chauffeur_id')
      .addSelect('operation.vehicle_id', 'operation_vehicle_id')
      .addSelect('operation.real_time_dispatch_id', 'operation_real_time_dispatch_id')
      .addSelect('operation.additional_costs', 'operation_additional_costs')
      .addSelect('operation.receipt_image_urls', 'operation_receipt_image_urls')
      .addSelect('operation.status', 'operation_status')
      .addSelect('operation.created_by', 'operation_created_by')
      .addSelect('operation.created_at', 'operation_created_at')
      .addSelect('operation.updated_by', 'operation_updated_by')
      .addSelect('operation.updated_at', 'operation_updated_at')
      .addSelect('chauffeur.id', 'chauffeur_id')
      .addSelect('chauffeur.name', 'chauffeur_name')
      .addSelect('chauffeur.phone', 'chauffeur_phone')
      .addSelect('chauffeur.birth_date', 'chauffeur_birth_date')
      .addSelect('chauffeur.profile_image_url', 'chauffeur_profile_image_url')
      .addSelect('chauffeur.type', 'chauffeur_type')
      .addSelect('chauffeur.chauffeur_status', 'chauffeur_status')
      .addSelect('chauffeur.vehicle_id', 'chauffeur_vehicle_id')
      .addSelect('chauffeur.role', 'chauffeur_role')
      .addSelect('chauffeur.status', 'chauffeur_data_status')
      .addSelect('chauffeur.created_by', 'chauffeur_created_by')
      .addSelect('chauffeur.created_at', 'chauffeur_created_at')
      .addSelect('chauffeur.updated_by', 'chauffeur_updated_by')
      .addSelect('chauffeur.updated_at', 'chauffeur_updated_at')
      .addSelect('vehicle.id', 'vehicle_id')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('vehicle.garage_id', 'vehicle_garage_id')
      .addSelect('vehicle.vehicle_status', 'vehicle_status')
      .addSelect('vehicle.status', 'vehicle_data_status')
      .addSelect('vehicle.created_by', 'vehicle_created_by')
      .addSelect('vehicle.created_at', 'vehicle_created_at')
      .addSelect('vehicle.updated_by', 'vehicle_updated_by')
      .addSelect('vehicle.updated_at', 'vehicle_updated_at')
      .addSelect('garage.id', 'garage_id')
      .addSelect('garage.name', 'garage_name')
      .addSelect('garage.address', 'garage_address')
      .addSelect('garage.status', 'garage_status')
      .addSelect('garage.created_by', 'garage_created_by')
      .addSelect('garage.created_at', 'garage_created_at')
      .addSelect('garage.updated_by', 'garage_updated_by')
      .addSelect('garage.updated_at', 'garage_updated_at')
      .addSelect('real_time_dispatch.id', 'dispatch_id')
      .addSelect('real_time_dispatch.departure_name', 'dispatch_departure_name')
      .addSelect('real_time_dispatch.departure_address', 'dispatch_departure_address')
      .addSelect('real_time_dispatch.departure_address_detail', 'dispatch_departure_address_detail')
      .addSelect('real_time_dispatch.destination_name', 'dispatch_destination_name')
      .addSelect('real_time_dispatch.destination_address', 'dispatch_destination_address')
      .addSelect('real_time_dispatch.destination_address_detail', 'dispatch_destination_address_detail')
      .addSelect('real_time_dispatch.status', 'dispatch_status')
      .addSelect('real_time_dispatch.created_by', 'dispatch_created_by')
      .addSelect('real_time_dispatch.created_at', 'dispatch_created_at')
      .addSelect('real_time_dispatch.updated_by', 'dispatch_updated_by')
      .addSelect('real_time_dispatch.updated_at', 'dispatch_updated_at')
      .where('reservation.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });

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
      // Operation 정보
      operation: {
        id: reservation.operation_id,
        type: reservation.operation_type,
        isRepeated: reservation.operation_is_repeated,
        startTime: reservation.operation_start_time,
        endTime: reservation.operation_end_time,
        distance: reservation.operation_distance,
        chauffeurId: reservation.operation_chauffeur_id,
        vehicleId: reservation.operation_vehicle_id,
        realTimeDispatchId: reservation.operation_real_time_dispatch_id,
        additionalCosts: reservation.operation_additional_costs,
        receiptImageUrls: reservation.operation_receipt_image_urls,
        status: reservation.operation_status,
        createdBy: reservation.operation_created_by,
        createdAt: reservation.operation_created_at,
        updatedBy: reservation.operation_updated_by,
        updatedAt: reservation.operation_updated_at,
      },
      // Chauffeur 정보
      chauffeur: reservation.chauffeur_id
        ? {
            id: reservation.chauffeur_id,
            name: reservation.chauffeur_name,
            phone: reservation.chauffeur_phone,
            birthDate: reservation.chauffeur_birth_date,
            profileImageUrl: reservation.chauffeur_profile_image_url,
            type: reservation.chauffeur_type,
            chauffeurStatus: reservation.chauffeur_status,
            vehicleId: reservation.chauffeur_vehicle_id,
            role: reservation.chauffeur_role,
            status: reservation.chauffeur_data_status,
            createdBy: reservation.chauffeur_created_by,
            createdAt: reservation.chauffeur_created_at,
            updatedBy: reservation.chauffeur_updated_by,
            updatedAt: reservation.chauffeur_updated_at,
          }
        : null,
      // Vehicle 정보
      vehicle: reservation.vehicle_id
        ? {
            id: reservation.vehicle_id,
            vehicleNumber: reservation.vehicle_number,
            modelName: reservation.vehicle_model_name,
            garageId: reservation.vehicle_garage_id,
            vehicleStatus: reservation.vehicle_status,
            status: reservation.vehicle_data_status,
            createdBy: reservation.vehicle_created_by,
            createdAt: reservation.vehicle_created_at,
            updatedBy: reservation.vehicle_updated_by,
            updatedAt: reservation.vehicle_updated_at,
          }
        : null,
      // Garage 정보
      garage: reservation.garage_id
        ? {
            id: reservation.garage_id,
            name: reservation.garage_name,
            address: reservation.garage_address,
            status: reservation.garage_status,
            createdBy: reservation.garage_created_by,
            createdAt: reservation.garage_created_at,
            updatedBy: reservation.garage_updated_by,
            updatedAt: reservation.garage_updated_at,
          }
        : null,
      // RealTimeDispatch 정보
      realTimeDispatch: reservation.dispatch_id
        ? {
            id: reservation.dispatch_id,
            departureName: reservation.dispatch_departure_name,
            departureAddress: reservation.dispatch_departure_address,
            departureAddressDetail: reservation.dispatch_departure_address_detail,
            destinationName: reservation.dispatch_destination_name,
            destinationAddress: reservation.dispatch_destination_address,
            destinationAddressDetail: reservation.dispatch_destination_address_detail,
            status: reservation.dispatch_status,
            createdBy: reservation.dispatch_created_by,
            createdAt: reservation.dispatch_created_at,
            updatedBy: reservation.dispatch_updated_by,
            updatedAt: reservation.dispatch_updated_at,
          }
        : null,
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
