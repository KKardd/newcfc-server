import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/create-real-time-dispatch.dto';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { UpdateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/update-real-time-dispatch.dto';
import { RealTimeDispatchResponseDto } from '@/adapter/inbound/dto/response/real-time-dispatch/real-time-dispatch-response.dto';

export abstract class RealTimeDispatchServiceInPort {
  abstract search(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<RealTimeDispatchResponseDto>>;

  abstract detail(id: number): Promise<RealTimeDispatchResponseDto>;

  abstract create(createRealTimeDispatch: CreateRealTimeDispatchDto): Promise<void>;

  abstract update(id: number, updateRealTimeDispatch: UpdateRealTimeDispatchDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
