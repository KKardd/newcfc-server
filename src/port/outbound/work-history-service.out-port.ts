import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export interface WorkHistoryServiceOutPort {
  findAll(
    searchWorkHistory: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[WorkHistory[], number]>;

  findById(id: number): Promise<WorkHistory | null>;

  findActiveByChauffeurId(chauffeurId: number): Promise<WorkHistory | null>;

  save(workHistory: WorkHistory): Promise<WorkHistory>;

  update(id: number, workHistory: Partial<WorkHistory>): Promise<UpdateResult>;

  updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
