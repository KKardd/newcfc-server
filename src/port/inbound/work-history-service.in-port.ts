import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/create-work-history.dto';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { UpdateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/update-work-history.dto';
import { WorkHistoryResponseDto } from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';

export interface WorkHistoryServiceInPort {
  search(
    searchWorkHistory: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WorkHistoryResponseDto>>;

  detail(id: number): Promise<WorkHistoryResponseDto>;

  create(createWorkHistory: CreateWorkHistoryDto): Promise<void>;

  update(id: number, updateWorkHistory: UpdateWorkHistoryDto): Promise<void>;

  delete(id: number): Promise<void>;

  startWork(chauffeurId: number, vehicleId?: number): Promise<void>;

  endWork(chauffeurId: number): Promise<void>;
}
