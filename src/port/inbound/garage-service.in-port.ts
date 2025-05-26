import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateGarageDto } from '@/adapter/inbound/dto/request/garage/create-garage.dto';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { UpdateGarageDto } from '@/adapter/inbound/dto/request/garage/update-garage.dto';
import { GarageResponseDto } from '@/adapter/inbound/dto/response/garage/garage-response.dto';

export abstract class GarageServiceInPort {
  abstract search(
    searchGarage: SearchGarageDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<GarageResponseDto>>;

  abstract detail(id: number): Promise<GarageResponseDto>;

  abstract create(createGarage: CreateGarageDto): Promise<void>;

  abstract update(id: number, updateGarage: UpdateGarageDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
