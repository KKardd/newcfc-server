import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class GarageServiceOutPort {
  abstract findAll(searchGarage: SearchGarageDto, paginationQuery: PaginationQuery, status?: string): Promise<[Garage[], number]>;

  abstract findById(id: number): Promise<Garage | null>;

  abstract findByIdWithVehicleCount(id: number): Promise<Garage | null>;

  abstract save(garage: Garage): Promise<Garage>;

  abstract update(id: number, garage: Partial<Garage>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
