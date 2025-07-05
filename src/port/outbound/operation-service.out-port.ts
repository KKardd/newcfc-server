import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class OperationServiceOutPort {
  abstract findAll(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<[OperationResponseDto[], number]>;

  abstract findById(id: number): Promise<Operation>;

  abstract findByIdWithDetails(id: number): Promise<OperationResponseDto>;

  abstract save(operation: Operation): Promise<void>;

  abstract update(id: number, operation: Partial<Operation>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
