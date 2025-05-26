import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWayPointDto } from '@/adapter/inbound/dto/request/way-point/create-way-point.dto';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { UpdateWayPointDto } from '@/adapter/inbound/dto/request/way-point/update-way-point.dto';
import { WayPointResponseDto } from '@/adapter/inbound/dto/response/way-point/way-point-response.dto';

export abstract class WayPointServiceInPort {
  abstract search(
    searchWayPoint: SearchWayPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WayPointResponseDto>>;

  abstract detail(id: number): Promise<WayPointResponseDto>;

  abstract create(createWayPoint: CreateWayPointDto): Promise<void>;

  abstract update(id: number, updateWayPoint: UpdateWayPointDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
