import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class VehicleServiceOutPort {
  abstract findAll(
    searchVehicle: SearchVehicleDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[Vehicle[], number]>;

  abstract findById(id: number): Promise<Vehicle | null>;

  abstract save(vehicle: Vehicle): Promise<Vehicle>;

  abstract update(id: number, vehicle: Partial<Vehicle>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;

  abstract findUnassignedVehicles(): Promise<Vehicle[]>;

  abstract countByGarageId(garageId: number): Promise<number>;
}
