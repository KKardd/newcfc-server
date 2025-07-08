import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { AssignChauffeurDto } from '@/adapter/inbound/dto/request/admin/assign-chauffeur.dto';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { AssignChauffeurResponseDto } from '@/adapter/inbound/dto/response/admin/assign-chauffeur-response.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';

export abstract class OperationServiceInPort {
  abstract search(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>>;

  abstract detail(id: number): Promise<OperationResponseDto>;

  abstract getAdminOperationDetail(id: number): Promise<any>;

  abstract create(createOperation: CreateOperationDto): Promise<void>;

  abstract update(id: number, updateOperation: UpdateOperationDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract assignChauffeur(assignDto: AssignChauffeurDto): Promise<AssignChauffeurResponseDto>;
}
