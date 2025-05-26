import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

@Injectable()
export class OperationRepository implements OperationServiceOutPort {
  constructor(
    @InjectRepository(Operation)
    private readonly repository: Repository<Operation>,
  ) {}

  async findAll(searchOperation: SearchOperationDto, paginationQuery: PaginationQuery): Promise<[Operation[], number]> {
    const query = this.repository.createQueryBuilder('operation');

    if (searchOperation.type) {
      query.andWhere('operation.type = :type', {
        type: searchOperation.type,
      });
    }

    if (searchOperation.isRepeated !== undefined) {
      query.andWhere('operation.isRepeated = :isRepeated', {
        isRepeated: searchOperation.isRepeated,
      });
    }

    if (searchOperation.startTime) {
      query.andWhere('operation.startTime >= :startTime', {
        startTime: searchOperation.startTime,
      });
    }

    if (searchOperation.endTime) {
      query.andWhere('operation.endTime <= :endTime', {
        endTime: searchOperation.endTime,
      });
    }

    if (searchOperation.chauffeurId) {
      query.andWhere('operation.chauffeurId = :chauffeurId', {
        chauffeurId: searchOperation.chauffeurId,
      });
    }

    if (searchOperation.vehicleId) {
      query.andWhere('operation.vehicleId = :vehicleId', {
        vehicleId: searchOperation.vehicleId,
      });
    }

    if (searchOperation.realTimeDispatchId) {
      query.andWhere('operation.realTimeDispatchId = :realTimeDispatchId', {
        realTimeDispatchId: searchOperation.realTimeDispatchId,
      });
    }

    if (searchOperation.status) {
      query.andWhere('operation.status = :status', {
        status: searchOperation.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
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
