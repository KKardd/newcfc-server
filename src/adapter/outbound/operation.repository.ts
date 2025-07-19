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
    const where: any = {};
    if (search.type) where.type = search.type;
    if (search.isRepeated !== undefined) where.isRepeated = search.isRepeated;
    if (search.startTime) where.startTime = MoreThanOrEqual(search.startTime);
    if (search.endTime) where.endTime = LessThanOrEqual(search.endTime);
    if (search.chauffeurId) where.chauffeurId = search.chauffeurId;
    if (search.vehicleId) where.vehicleId = search.vehicleId;
    if (search.realTimeDispatchId) where.realTimeDispatchId = search.realTimeDispatchId;

    // search.status가 있으면 우선적으로 사용
    if (search.status) {
      where.status = search.status;
    } else if (status === DataStatus.DELETED) {
      // search.status가 없고 세번째 파라미터가 DELETED면 삭제된 것 제외
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }

    return this.operationRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { startTime: 'DESC', createdAt: 'DESC' },
      where,
    });
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

    const result = await this.operationRepository.update(id, operation);

    console.log('Update Result:', result);
    console.log('Affected rows:', result.affected);

    return result;
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.operationRepository.update(id, { status });
  }
}
