import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { GarageResponseDto } from '@/adapter/inbound/dto/response/garage/garage-response.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class GarageServiceOutPort {
  abstract findAll(searchGarage: SearchGarageDto, paginationQuery: PaginationQuery): Promise<[GarageResponseDto[], number]>;

  abstract findById(id: number): Promise<Garage>;

  abstract findByIdWithVehicleCount(id: number): Promise<GarageResponseDto>;

  abstract save(garage: Garage): Promise<void>;

  abstract update(id: number, garage: Partial<Garage>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
