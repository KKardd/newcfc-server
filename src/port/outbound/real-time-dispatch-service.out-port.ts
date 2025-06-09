import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatchResponseDto } from '@/adapter/inbound/dto/response/real-time-dispatch/real-time-dispatch-response.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class RealTimeDispatchServiceOutPort {
  abstract findAll(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<[RealTimeDispatchResponseDto[], number]>;

  abstract findById(id: number): Promise<RealTimeDispatch>;

  abstract save(realTimeDispatch: RealTimeDispatch): Promise<void>;

  abstract update(id: number, realTimeDispatch: Partial<RealTimeDispatch>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
