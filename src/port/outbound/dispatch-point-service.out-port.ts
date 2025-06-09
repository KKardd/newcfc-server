import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPointResponseDto } from '@/adapter/inbound/dto/response/dispatch-point/dispatch-point-response.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class DispatchPointServiceOutPort {
  abstract findAll(
    searchDispatchPoint: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<[DispatchPointResponseDto[], number]>;

  abstract findById(id: number): Promise<DispatchPoint>;

  abstract save(dispatchPoint: DispatchPoint): Promise<void>;

  abstract update(id: number, dispatchPoint: Partial<DispatchPoint>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
