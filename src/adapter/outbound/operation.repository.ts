import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { convertKstToUtc, createKstDateRange } from '@/util/date';

@Injectable()
export class OperationRepository implements OperationServiceOutPort {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async findAll(search: SearchOperationDto, paginationQuery: PaginationQuery, status?: string): Promise<[Operation[], number]> {
    const queryBuilder = this.operationRepository.createQueryBuilder('operation');

    // 기본 조건들
    if (search.type) {
      queryBuilder.andWhere('operation.type = :type', { type: search.type });
    }
    if (search.isRepeated !== undefined) {
      queryBuilder.andWhere('operation.isRepeated = :isRepeated', { isRepeated: search.isRepeated });
    }
    if (search.chauffeurId) {
      queryBuilder.andWhere('operation.chauffeurId = :chauffeurId', { chauffeurId: search.chauffeurId });
    }
    if (search.vehicleId) {
      queryBuilder.andWhere('operation.vehicleId = :vehicleId', { vehicleId: search.vehicleId });
    }
    if (search.realTimeDispatchId) {
      queryBuilder.andWhere('operation.realTimeDispatchId = :realTimeDispatchId', {
        realTimeDispatchId: search.realTimeDispatchId,
      });
    }

    // 상태 조건
    if (search.status) {
      queryBuilder.andWhere('operation.status = :status', { status: search.status });
    } else if (status === DataStatus.DELETED) {
      queryBuilder.andWhere('operation.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });
    } else if (status) {
      queryBuilder.andWhere('operation.status = :status', { status });
    }

    // 시간 검색 로직 개선 - 운행 중인 상태도 포함 (type 필터 고려)
    if (search.startTime && search.endTime) {
      const startDate = createKstDateRange(search.startTime, true);
      const endDate = createKstDateRange(search.endTime, false);

      // 기사 테이블과 LEFT JOIN
      queryBuilder.leftJoin('chauffeur', 'chauffeur', 'chauffeur.id = operation.chauffeur_id');

      if (search.type) {
        // type 필터가 있는 경우: 해당 타입의 운행만 조회
        queryBuilder.andWhere(
          `
          (operation.startTime BETWEEN :startDate AND :endDate)
          OR
          (
            operation.startTime >= :startDate
            AND chauffeur.chauffeur_status IN (:...inProgressStatuses)
            AND operation.type = :typeForTime
          )
        `,
          {
            startDate,
            endDate,
            typeForTime: search.type,
            inProgressStatuses: [
              ChauffeurStatus.MOVING_TO_DEPARTURE,
              ChauffeurStatus.WAITING_FOR_PASSENGER,
              ChauffeurStatus.IN_OPERATION,
              ChauffeurStatus.WAITING_OPERATION,
              ChauffeurStatus.PENDING_RECEIPT_INPUT,
            ],
          },
        );
      } else {
        // type 필터가 없는 경우: 기존 로직
        queryBuilder.andWhere(
          `
          (operation.startTime BETWEEN :startDate AND :endDate)
          OR
          (
            operation.startTime >= :startDate
            AND chauffeur.chauffeur_status IN (:...inProgressStatuses)
          )
        `,
          {
            startDate,
            endDate,
            inProgressStatuses: [
              ChauffeurStatus.MOVING_TO_DEPARTURE,
              ChauffeurStatus.WAITING_FOR_PASSENGER,
              ChauffeurStatus.IN_OPERATION,
              ChauffeurStatus.WAITING_OPERATION,
              ChauffeurStatus.PENDING_RECEIPT_INPUT,
            ],
          },
        );
      }
    } else if (search.startTime) {
      const startDate = createKstDateRange(search.startTime, true);
      queryBuilder.andWhere('operation.startTime >= :startDate', { startDate });
    } else if (search.endTime) {
      const endDate = createKstDateRange(search.endTime, false);

      // 기사 테이블과 LEFT JOIN
      queryBuilder.leftJoin('chauffeur', 'chauffeur', 'chauffeur.id = operation.chauffeur_id');

      if (search.type) {
        // type 필터가 있는 경우: 해당 타입의 운행만 조회
        queryBuilder.andWhere(
          `
          (operation.startTime <= :endDate)
          OR
          (
            chauffeur.chauffeur_status IN (:...inProgressStatuses)
            AND operation.type = :typeForEndTime
          )
        `,
          {
            endDate,
            typeForEndTime: search.type,
            inProgressStatuses: [
              ChauffeurStatus.MOVING_TO_DEPARTURE,
              ChauffeurStatus.WAITING_FOR_PASSENGER,
              ChauffeurStatus.IN_OPERATION,
              ChauffeurStatus.WAITING_OPERATION,
              ChauffeurStatus.PENDING_RECEIPT_INPUT,
            ],
          },
        );
      } else {
        // type 필터가 없는 경우: 기존 로직
        queryBuilder.andWhere(
          `
          (operation.startTime <= :endDate)
          OR
          (chauffeur.chauffeur_status IN (:...inProgressStatuses))
        `,
          {
            endDate,
            inProgressStatuses: [
              ChauffeurStatus.MOVING_TO_DEPARTURE,
              ChauffeurStatus.WAITING_FOR_PASSENGER,
              ChauffeurStatus.IN_OPERATION,
              ChauffeurStatus.WAITING_OPERATION,
              ChauffeurStatus.PENDING_RECEIPT_INPUT,
            ],
          },
        );
      }
    }

    // 정렬 및 페이징
    queryBuilder
      .orderBy('operation.startTime', 'DESC')
      .addOrderBy('operation.createdAt', 'DESC')
      .skip(paginationQuery.skip)
      .take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }


  async findById(id: number): Promise<Operation | null> {
    return this.operationRepository.findOne({ where: { id } });
  }

  async findByIdWithDetails(id: number): Promise<Operation | null> {
    return this.operationRepository.findOne({ where: { id } });
  }

  async save(operation: Operation): Promise<Operation> {
    return this.operationRepository.save(operation);
  }

  async update(id: number, operation: Partial<Operation>) {
    console.log('=== Repository Update Debug ===');
    console.log('ID:', id);
    console.log('Operation Data:', JSON.stringify(operation, null, 2));

    // 업데이트 전 현재 데이터 확인
    const beforeUpdate = await this.operationRepository.findOne({ where: { id } });
    console.log('Before Update - Distance:', beforeUpdate?.distance);
    console.log('Before Update - AdditionalCosts:', beforeUpdate?.additionalCosts);
    console.log('Before Update - ReceiptImageUrls:', beforeUpdate?.receiptImageUrls);

    const result = await this.operationRepository.update(id, operation);

    console.log('Update Result:', result);
    console.log('Affected rows:', result.affected);

    // 업데이트 후 데이터 확인
    const afterUpdate = await this.operationRepository.findOne({ where: { id } });
    console.log('After Update - Distance:', afterUpdate?.distance);
    console.log('After Update - AdditionalCosts:', afterUpdate?.additionalCosts);
    console.log('After Update - ReceiptImageUrls:', afterUpdate?.receiptImageUrls);

    return result;
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.operationRepository.update(id, { status });
  }
}
