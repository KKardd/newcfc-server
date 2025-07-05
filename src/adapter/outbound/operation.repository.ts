import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

@Injectable()
export class OperationRepository implements OperationServiceOutPort {
  constructor(
    @InjectRepository(Operation)
    private readonly repository: Repository<Operation>,
    @InjectRepository(WayPoint)
    private readonly wayPointRepository: Repository<WayPoint>,
  ) {}

  async findAll(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<[OperationResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('operation')
      .leftJoin('chauffeur', 'chauffeur', 'operation.chauffeur_id = chauffeur.id')
      .leftJoin('vehicle', 'vehicle', 'operation.vehicle_id = vehicle.id')
      .leftJoin('garage', 'garage', 'vehicle.garage_id = garage.id')
      .leftJoin('real_time_dispatch', 'real_time_dispatch', 'operation.real_time_dispatch_id = real_time_dispatch.id')
      .leftJoin('reservation', 'reservation', 'operation.id = reservation.operation_id')
      .select('operation.*')
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
      .addSelect('real_time_dispatch.name', 'dispatch_name')
      .addSelect('real_time_dispatch.description', 'dispatch_description')
      .addSelect('real_time_dispatch.departure_address', 'dispatch_departure_address')
      .addSelect('real_time_dispatch.destination_address', 'dispatch_destination_address')
      .addSelect('real_time_dispatch.status', 'dispatch_status')
      .addSelect('real_time_dispatch.created_by', 'dispatch_created_by')
      .addSelect('real_time_dispatch.created_at', 'dispatch_created_at')
      .addSelect('real_time_dispatch.updated_by', 'dispatch_updated_by')
      .addSelect('real_time_dispatch.updated_at', 'dispatch_updated_at')
      .addSelect('reservation.id', 'reservation_id')
      .addSelect('reservation.operation_id', 'reservation_operation_id')
      .addSelect('reservation.passenger_name', 'reservation_passenger_name')
      .addSelect('reservation.passenger_phone', 'reservation_passenger_phone')
      .addSelect('reservation.passenger_email', 'reservation_passenger_email')
      .addSelect('reservation.passenger_count', 'reservation_passenger_count')
      .addSelect('reservation.safety_phone', 'reservation_safety_phone')
      .addSelect('reservation.memo', 'reservation_memo')
      .addSelect('reservation.status', 'reservation_status')
      .addSelect('reservation.created_by', 'reservation_created_by')
      .addSelect('reservation.created_at', 'reservation_created_at')
      .addSelect('reservation.updated_by', 'reservation_updated_by')
      .addSelect('reservation.updated_at', 'reservation_updated_at');

    if (searchOperation.type) {
      queryBuilder.andWhere('operation.type = :type', {
        type: searchOperation.type,
      });
    }

    if (searchOperation.isRepeated !== undefined) {
      queryBuilder.andWhere('operation.is_repeated = :isRepeated', {
        isRepeated: searchOperation.isRepeated,
      });
    }

    if (searchOperation.startTime) {
      queryBuilder.andWhere('operation.start_time >= :startTime', {
        startTime: searchOperation.startTime,
      });
    }

    if (searchOperation.endTime) {
      queryBuilder.andWhere('operation.end_time <= :endTime', {
        endTime: searchOperation.endTime,
      });
    }

    if (searchOperation.chauffeurId) {
      queryBuilder.andWhere('operation.chauffeur_id = :chauffeurId', {
        chauffeurId: searchOperation.chauffeurId,
      });
    }

    if (searchOperation.vehicleId) {
      queryBuilder.andWhere('operation.vehicle_id = :vehicleId', {
        vehicleId: searchOperation.vehicleId,
      });
    }

    if (searchOperation.realTimeDispatchId) {
      queryBuilder.andWhere('operation.real_time_dispatch_id = :realTimeDispatchId', {
        realTimeDispatchId: searchOperation.realTimeDispatchId,
      });
    }

    if (searchOperation.status) {
      queryBuilder.andWhere('operation.status = :status', {
        status: searchOperation.status,
      });
    }

    queryBuilder.orderBy('operation.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const operations = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    // Get waypoints for all operations
    const operationIds = operations.map((op) => op.id);
    const wayPoints =
      operationIds.length > 0
        ? await this.wayPointRepository
            .createQueryBuilder('waypoint')
            .where('waypoint.operation_id IN (:...operationIds)', { operationIds })
            .andWhere('waypoint.status NOT IN (:...excludedStatuses)', {
              excludedStatuses: [DataStatus.DELETED, DataStatus.CANCELLED],
            })
            .orderBy('waypoint.operation_id', 'ASC')
            .addOrderBy('waypoint.order', 'ASC')
            .getMany()
        : [];

    // Group waypoints by operation_id
    const wayPointsByOperation = wayPoints.reduce(
      (acc, wayPoint) => {
        if (!acc[wayPoint.operationId]) {
          acc[wayPoint.operationId] = [];
        }
        acc[wayPoint.operationId].push(wayPoint);
        return acc;
      },
      {} as Record<number, WayPoint[]>,
    );

    const operationsResponse: OperationResponseDto[] = operations.map((operation) => ({
      id: operation.id,
      type: operation.type,
      isRepeated: operation.is_repeated,
      startTime: operation.start_time,
      endTime: operation.end_time,
      distance: operation.distance,
      chauffeurId: operation.chauffeur_id,
      chauffeurName: operation.chauffeur_name || null,
      chauffeurPhone: operation.chauffeur_phone || null,
      passengerCount: operation.reservation_passenger_count || null,
      vehicleId: operation.vehicle_id,
      realTimeDispatchId: operation.real_time_dispatch_id,
      additionalCosts: operation.additional_costs,
      receiptImageUrls: operation.receipt_image_urls,
      status: operation.status,
      createdBy: operation.created_by,
      createdAt: operation.created_at,
      updatedBy: operation.updated_by,
      updatedAt: operation.updated_at,
      // Chauffeur 정보
      chauffeur: operation.chauffeur_id
        ? {
            id: operation.chauffeur_id,
            name: operation.chauffeur_name,
            phone: operation.chauffeur_phone,
            birthDate: operation.chauffeur_birth_date,
            profileImageUrl: operation.chauffeur_profile_image_url,
            type: operation.chauffeur_type,
            chauffeurStatus: operation.chauffeur_status,
            vehicleId: operation.chauffeur_vehicle_id,
            role: operation.chauffeur_role,
            status: operation.chauffeur_data_status,
            createdBy: operation.chauffeur_created_by,
            createdAt: operation.chauffeur_created_at,
            updatedBy: operation.chauffeur_updated_by,
            updatedAt: operation.chauffeur_updated_at,
          }
        : null,
      // Vehicle 정보
      vehicle: operation.vehicle_id
        ? {
            id: operation.vehicle_id,
            vehicleNumber: operation.vehicle_number,
            modelName: operation.vehicle_model_name,
            garageId: operation.vehicle_garage_id,
            vehicleStatus: operation.vehicle_status,
            status: operation.vehicle_data_status,
            createdBy: operation.vehicle_created_by,
            createdAt: operation.vehicle_created_at,
            updatedBy: operation.vehicle_updated_by,
            updatedAt: operation.vehicle_updated_at,
          }
        : null,
      // Garage 정보
      garage: operation.garage_id
        ? {
            id: operation.garage_id,
            name: operation.garage_name,
            address: operation.garage_address,
            status: operation.garage_status,
            createdBy: operation.garage_created_by,
            createdAt: operation.garage_created_at,
            updatedBy: operation.garage_updated_by,
            updatedAt: operation.garage_updated_at,
          }
        : null,
      // RealTimeDispatch 정보
      realTimeDispatch: operation.real_time_dispatch_id
        ? {
            id: operation.dispatch_id,
            name: operation.dispatch_name,
            description: operation.dispatch_description,
            departureAddress: operation.dispatch_departure_address,
            destinationAddress: operation.dispatch_destination_address,
            status: operation.dispatch_status,
            createdBy: operation.dispatch_created_by,
            createdAt: operation.dispatch_created_at,
            updatedBy: operation.dispatch_updated_by,
            updatedAt: operation.dispatch_updated_at,
          }
        : null,
      // Reservation 정보 (새로 추가)
      reservation: operation.reservation_id
        ? {
            id: operation.reservation_id,
            operationId: operation.reservation_operation_id,
            passengerName: operation.reservation_passenger_name,
            passengerPhone: operation.reservation_passenger_phone,
            passengerEmail: operation.reservation_passenger_email,
            passengerCount: operation.reservation_passenger_count,
            safetyPhone: operation.reservation_safety_phone,
            memo: operation.reservation_memo,
            status: operation.reservation_status,
            createdBy: operation.reservation_created_by,
            createdAt: operation.reservation_created_at,
            updatedBy: operation.reservation_updated_by,
            updatedAt: operation.reservation_updated_at,
          }
        : null,
      // WayPoints 정보
      wayPoints: (wayPointsByOperation[operation.id] || []).map((wayPoint) => ({
        id: wayPoint.id,
        operationId: wayPoint.operationId,
        address: wayPoint.address,
        addressDetail: wayPoint.addressDetail,
        chauffeurStatus: wayPoint.chauffeurStatus,
        latitude: wayPoint.latitude,
        longitude: wayPoint.longitude,
        order: wayPoint.order,
        status: wayPoint.status,
        createdBy: wayPoint.createdBy,
        createdAt: wayPoint.createdAt,
        updatedBy: wayPoint.updatedBy,
        updatedAt: wayPoint.updatedAt,
      })),
    }));

    return [operationsResponse, totalCount];
  }

  async findById(id: number): Promise<Operation> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async findByIdWithDetails(id: number): Promise<OperationResponseDto> {
    const queryBuilder = this.repository
      .createQueryBuilder('operation')
      .leftJoin('chauffeur', 'chauffeur', 'operation.chauffeur_id = chauffeur.id')
      .leftJoin('vehicle', 'vehicle', 'operation.vehicle_id = vehicle.id')
      .leftJoin('garage', 'garage', 'vehicle.garage_id = garage.id')
      .leftJoin('real_time_dispatch', 'real_time_dispatch', 'operation.real_time_dispatch_id = real_time_dispatch.id')
      .leftJoin('reservation', 'reservation', 'operation.id = reservation.operation_id')
      .select('operation.*')
      .addSelect('operation.kakao_path', 'kakao_path')
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
      .addSelect('real_time_dispatch.name', 'dispatch_name')
      .addSelect('real_time_dispatch.description', 'dispatch_description')
      .addSelect('real_time_dispatch.departure_address', 'dispatch_departure_address')
      .addSelect('real_time_dispatch.destination_address', 'dispatch_destination_address')
      .addSelect('real_time_dispatch.status', 'dispatch_status')
      .addSelect('real_time_dispatch.created_by', 'dispatch_created_by')
      .addSelect('real_time_dispatch.created_at', 'dispatch_created_at')
      .addSelect('real_time_dispatch.updated_by', 'dispatch_updated_by')
      .addSelect('real_time_dispatch.updated_at', 'dispatch_updated_at')
      .addSelect('reservation.id', 'reservation_id')
      .addSelect('reservation.operation_id', 'reservation_operation_id')
      .addSelect('reservation.passenger_name', 'reservation_passenger_name')
      .addSelect('reservation.passenger_phone', 'reservation_passenger_phone')
      .addSelect('reservation.passenger_email', 'reservation_passenger_email')
      .addSelect('reservation.passenger_count', 'reservation_passenger_count')
      .addSelect('reservation.safety_phone', 'reservation_safety_phone')
      .addSelect('reservation.memo', 'reservation_memo')
      .addSelect('reservation.status', 'reservation_status')
      .addSelect('reservation.created_by', 'reservation_created_by')
      .addSelect('reservation.created_at', 'reservation_created_at')
      .addSelect('reservation.updated_by', 'reservation_updated_by')
      .addSelect('reservation.updated_at', 'reservation_updated_at')
      .where('operation.id = :id', { id });

    const operation = await queryBuilder.getRawOne();

    if (!operation) {
      throw new Error(`Operation with id ${id} not found`);
    }

    // 경유지 정보 조회
    const wayPoints = await this.wayPointRepository
      .createQueryBuilder('waypoint')
      .where('waypoint.operation_id = :operationId', { operationId: id })
      .andWhere('waypoint.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [DataStatus.DELETED, DataStatus.CANCELLED],
      })
      .orderBy('waypoint.order', 'ASC')
      .getMany();

    // 응답 생성
    const operationResponse: OperationResponseDto = {
      id: operation.id,
      type: operation.type,
      isRepeated: operation.is_repeated,
      startTime: operation.start_time,
      endTime: operation.end_time,
      distance: operation.distance,
      chauffeurId: operation.chauffeur_id,
      chauffeurName: operation.chauffeur_name || null,
      chauffeurPhone: operation.chauffeur_phone || null,
      passengerCount: operation.reservation_passenger_count || null,
      vehicleId: operation.vehicle_id,
      realTimeDispatchId: operation.real_time_dispatch_id,
      additionalCosts: operation.additional_costs,
      receiptImageUrls: operation.receipt_image_urls,
      kakaoPath: operation.kakao_path,
      status: operation.status,
      createdBy: operation.created_by,
      createdAt: operation.created_at,
      updatedBy: operation.updated_by,
      updatedAt: operation.updated_at,
      // Chauffeur 정보
      chauffeur: operation.chauffeur_id
        ? {
            id: operation.chauffeur_id,
            name: operation.chauffeur_name,
            phone: operation.chauffeur_phone,
            birthDate: operation.chauffeur_birth_date,
            profileImageUrl: operation.chauffeur_profile_image_url,
            type: operation.chauffeur_type,
            chauffeurStatus: operation.chauffeur_status,
            vehicleId: operation.chauffeur_vehicle_id,
            role: operation.chauffeur_role,
            status: operation.chauffeur_data_status,
            createdBy: operation.chauffeur_created_by,
            createdAt: operation.chauffeur_created_at,
            updatedBy: operation.chauffeur_updated_by,
            updatedAt: operation.chauffeur_updated_at,
          }
        : null,
      // Vehicle 정보
      vehicle: operation.vehicle_id
        ? {
            id: operation.vehicle_id,
            vehicleNumber: operation.vehicle_number,
            modelName: operation.vehicle_model_name,
            garageId: operation.vehicle_garage_id,
            vehicleStatus: operation.vehicle_status,
            status: operation.vehicle_data_status,
            createdBy: operation.vehicle_created_by,
            createdAt: operation.vehicle_created_at,
            updatedBy: operation.vehicle_updated_by,
            updatedAt: operation.vehicle_updated_at,
          }
        : null,
      // Garage 정보
      garage: operation.garage_id
        ? {
            id: operation.garage_id,
            name: operation.garage_name,
            address: operation.garage_address,
            status: operation.garage_status,
            createdBy: operation.garage_created_by,
            createdAt: operation.garage_created_at,
            updatedBy: operation.garage_updated_by,
            updatedAt: operation.garage_updated_at,
          }
        : null,
      // RealTimeDispatch 정보
      realTimeDispatch: operation.real_time_dispatch_id
        ? {
            id: operation.dispatch_id,
            name: operation.dispatch_name,
            description: operation.dispatch_description,
            departureAddress: operation.dispatch_departure_address,
            destinationAddress: operation.dispatch_destination_address,
            status: operation.dispatch_status,
            createdBy: operation.dispatch_created_by,
            createdAt: operation.dispatch_created_at,
            updatedBy: operation.dispatch_updated_by,
            updatedAt: operation.dispatch_updated_at,
          }
        : null,
      // Reservation 정보
      reservation: operation.reservation_id
        ? {
            id: operation.reservation_id,
            operationId: operation.reservation_operation_id,
            passengerName: operation.reservation_passenger_name,
            passengerPhone: operation.reservation_passenger_phone,
            passengerEmail: operation.reservation_passenger_email,
            passengerCount: operation.reservation_passenger_count,
            safetyPhone: operation.reservation_safety_phone,
            memo: operation.reservation_memo,
            status: operation.reservation_status,
            createdBy: operation.reservation_created_by,
            createdAt: operation.reservation_created_at,
            updatedBy: operation.reservation_updated_by,
            updatedAt: operation.reservation_updated_at,
          }
        : null,
      // WayPoints 정보
      wayPoints: wayPoints.map((wayPoint) => ({
        id: wayPoint.id,
        operationId: wayPoint.operationId,
        address: wayPoint.address,
        addressDetail: wayPoint.addressDetail,
        chauffeurStatus: wayPoint.chauffeurStatus,
        latitude: wayPoint.latitude,
        longitude: wayPoint.longitude,
        order: wayPoint.order,
        status: wayPoint.status,
        createdBy: wayPoint.createdBy,
        createdAt: wayPoint.createdAt,
        updatedBy: wayPoint.updatedBy,
        updatedAt: wayPoint.updatedAt,
      })),
    };

    return operationResponse;
  }

  async save(operation: Operation): Promise<void> {
    await this.repository.save(operation);
  }

  async update(id: number, operation: Partial<Operation>): Promise<void> {
    await this.repository.update(id, operation);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
