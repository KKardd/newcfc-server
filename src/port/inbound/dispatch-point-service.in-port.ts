import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/create-dispatch-point.dto';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { UpdateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/update-dispatch-point.dto';
import { DispatchPointResponseDto } from '@/adapter/inbound/dto/response/dispatch-point/dispatch-point-response.dto';

export abstract class DispatchPointServiceInPort {
  abstract search(
    searchDispatchPoint: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<DispatchPointResponseDto>>;

  abstract detail(id: number): Promise<DispatchPointResponseDto>;

  abstract create(createDispatchPoint: CreateDispatchPointDto): Promise<void>;

  abstract update(id: number, updateDispatchPoint: UpdateDispatchPointDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
