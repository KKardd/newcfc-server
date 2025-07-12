import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class DispatchPointServiceOutPort {
  abstract findAll(
    searchDispatchPoint: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<[DispatchPoint[], number]>;

  abstract findById(id: number): Promise<DispatchPoint | null>;

  abstract save(dispatchPoint: DispatchPoint): Promise<DispatchPoint>;

  abstract update(id: number, dispatchPoint: Partial<DispatchPoint>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
