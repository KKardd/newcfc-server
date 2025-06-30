import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { UnassignedVehicleDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { VehicleResponseDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class VehicleServiceOutPort {
  abstract findAll(searchVehicle: SearchVehicleDto, paginationQuery: PaginationQuery): Promise<[VehicleResponseDto[], number]>;

  abstract findById(id: number): Promise<Vehicle>;

  abstract save(vehicle: Vehicle): Promise<void>;

  abstract update(id: number, vehicle: Partial<Vehicle>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;

  abstract findUnassignedVehicles(): Promise<UnassignedVehicleDto[]>;
}
