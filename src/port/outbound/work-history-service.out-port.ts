import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistoryResponseDto } from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export interface WorkHistoryServiceOutPort {
  findAll(searchWorkHistory: SearchWorkHistoryDto, paginationQuery: PaginationQuery): Promise<[WorkHistoryResponseDto[], number]>;

  findById(id: number): Promise<WorkHistory>;

  findActiveByChauffeurId(chauffeurId: number): Promise<WorkHistory | null>;

  save(workHistory: WorkHistory): Promise<void>;

  update(id: number, workHistory: Partial<WorkHistory>): Promise<void>;

  updateStatus(id: number, status: DataStatus): Promise<void>;
}
