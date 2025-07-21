import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

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

    // 시간 검색 로직 개선 - 운행 중인 상태도 포함
    if (search.startTime && search.endTime) {
      const startDate = this.convertKstDateToSearchRange(search.startTime, true);
      const endDate = this.convertKstDateToSearchRange(search.endTime, false);

      // 기사 테이블과 LEFT JOIN
      queryBuilder.leftJoin('chauffeur', 'chauffeur', 'chauffeur.id = operation.chauffeur_id');

      // 조건 1: 운행 시작시간이 검색 범위 내에 있는 경우
      // 조건 2: 현재 운행 중인 상태이고, 운행 시작시간이 검색 시작일 이후인 경우
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
    } else if (search.startTime) {
      const startDate = this.convertKstDateToSearchRange(search.startTime, true);
      queryBuilder.andWhere('operation.startTime >= :startDate', { startDate });
    } else if (search.endTime) {
      const endDate = this.convertKstDateToSearchRange(search.endTime, false);

      // 기사 테이블과 LEFT JOIN
      queryBuilder.leftJoin('chauffeur', 'chauffeur', 'chauffeur.id = operation.chauffeur_id');

      // 조건 1: 운행 시작시간이 종료일 이전인 경우
      // 조건 2: 현재 운행 중인 상태인 경우 (endTime이 지났어도 포함)
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

    // 정렬 및 페이징
    queryBuilder
      .orderBy('operation.startTime', 'DESC')
      .addOrderBy('operation.createdAt', 'DESC')
      .skip(paginationQuery.skip)
      .take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  /**
   * KST 날짜를 검색 범위로 변환
   * @param date 입력된 날짜 (KST 기준)
   * @param isStart true면 해당 날짜의 00:00:00, false면 23:59:59
   */
  private convertKstDateToSearchRange(date: Date, isStart: boolean): Date {
    // 입력된 날짜를 KST 기준으로 처리
    const kstDate = new Date(date);

    if (isStart) {
      // 해당 날짜의 00:00:00 KST
      kstDate.setHours(0, 0, 0, 0);
    } else {
      // 해당 날짜의 23:59:59.999 KST
      kstDate.setHours(23, 59, 59, 999);
    }

    // KST를 UTC로 변환 (한국은 UTC+9)
    // 주의: DB에 저장된 시간이 UTC인지 KST인지에 따라 변환 방식이 달라질 수 있습니다.
    // 현재 코드는 DB에 KST로 저장되어 있다고 가정하고 그대로 반환합니다.
    return kstDate;
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
