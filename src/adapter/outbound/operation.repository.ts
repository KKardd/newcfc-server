import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

@Injectable()
export class OperationRepository implements OperationServiceOutPort {
  constructor(
    @InjectRepository(Operation)
    private readonly repository: Repository<Operation>,
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
      .select('operation.*')
      .addSelect('chauffeur.name', 'chauffeur_name')
      .addSelect('chauffeur.phone', 'chauffeur_phone')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('garage.name', 'garage_name')
      .addSelect('real_time_dispatch.origin_name', 'dispatch_origin_name')
      .addSelect('real_time_dispatch.destination_name', 'dispatch_destination_name');

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

    const operationsResponse: OperationResponseDto[] = operations.map((operation) => ({
      id: operation.id,
      type: operation.type,
      isRepeated: operation.is_repeated,
      startTime: operation.start_time,
      endTime: operation.end_time,
      distance: operation.distance,
      chauffeurId: operation.chauffeur_id,
      chauffeurName: operation.chauffeur_name,
      chauffeurPhone: operation.chauffeur_phone,
      vehicleId: operation.vehicle_id,
      vehicleNumber: operation.vehicle_number,
      vehicleModelName: operation.vehicle_model_name,
      garageName: operation.garage_name,
      realTimeDispatchId: operation.real_time_dispatch_id,
      dispatchOriginName: operation.dispatch_origin_name,
      dispatchDestinationName: operation.dispatch_destination_name,
      additionalCosts: operation.additional_costs,
      receiptImageUrls: operation.receipt_image_urls,
      status: operation.status,
      createdBy: operation.created_by,
      createdAt: operation.created_at,
      updatedBy: operation.updated_by,
      updatedAt: operation.updated_at,
    }));

    return [operationsResponse, totalCount];
  }

  async findById(id: number): Promise<Operation> {
    return await this.repository.findOneOrFail({ where: { id } });
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
