import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class RealTimeDispatchServiceOutPort {
  abstract findAll(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<[RealTimeDispatch[], number]>;

  abstract findById(id: number): Promise<RealTimeDispatch | null>;

  abstract save(realTimeDispatch: RealTimeDispatch): Promise<RealTimeDispatch>;

  abstract update(id: number, realTimeDispatch: Partial<RealTimeDispatch>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
