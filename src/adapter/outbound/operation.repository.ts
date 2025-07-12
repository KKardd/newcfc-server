import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

@Injectable()
export class OperationRepository implements OperationServiceOutPort {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async findAll(search: SearchOperationDto, paginationQuery: PaginationQuery, status?: string): Promise<[Operation[], number]> {
    // 기존 queryBuilder 로직을 this.operationRepository.createQueryBuilder로 옮겨서 사용해도 됨
    // 또는 where 객체로 단순화 가능
    // 여기서는 where 객체 방식으로 예시
    const where: any = {};
    if (search.type) where.type = search.type;
    if (search.isRepeated !== undefined) where.isRepeated = search.isRepeated;
    if (search.startTime) where.startTime = MoreThanOrEqual(search.startTime);
    if (search.endTime) where.endTime = LessThanOrEqual(search.endTime);
    if (search.chauffeurId) where.chauffeurId = search.chauffeurId;
    if (search.vehicleId) where.vehicleId = search.vehicleId;
    if (search.realTimeDispatchId) where.realTimeDispatchId = search.realTimeDispatchId;
    if (status === 'delete') {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.operationRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { startTime: 'DESC' },
      where,
      relations: ['chauffeur', 'vehicle', 'realTimeDispatch', 'realTimeDispatch.wayPoints'],
    });
  }

  async findById(id: number): Promise<Operation | null> {
    return this.operationRepository.findOne({ where: { id } });
  }

  async findByIdWithDetails(id: number): Promise<Operation | null> {
    return this.operationRepository.findOne({
      where: { id },
      relations: ['chauffeur', 'vehicle', 'realTimeDispatch', 'realTimeDispatch.wayPoints'],
    });
  }

  async save(operation: Operation): Promise<Operation> {
    return this.operationRepository.save(operation);
  }

  async update(id: number, operation: Partial<Operation>) {
    return this.operationRepository.update(id, operation);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.operationRepository.update(id, { status });
  }
}
