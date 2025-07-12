import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class OperationServiceOutPort {
  abstract findAll(searchOperation: SearchOperationDto, paginationQuery: PaginationQuery): Promise<[Operation[], number]>;

  abstract findById(id: number): Promise<Operation | null>;

  abstract findByIdWithDetails(id: number): Promise<Operation | null>;

  abstract save(operation: Operation): Promise<Operation>;

  abstract update(id: number, operation: Partial<Operation>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
