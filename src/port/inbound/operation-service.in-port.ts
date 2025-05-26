import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';

export abstract class OperationServiceInPort {
  abstract search(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>>;

  abstract detail(id: number): Promise<OperationResponseDto>;

  abstract create(createOperation: CreateOperationDto): Promise<void>;

  abstract update(id: number, updateOperation: UpdateOperationDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
