import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/create-vehicle.dto';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { UpdateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/update-vehicle.dto';
import { VehicleResponseDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';

export abstract class VehicleServiceInPort {
  abstract search(
    searchVehicle: SearchVehicleDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<VehicleResponseDto>>;

  abstract detail(id: number): Promise<VehicleResponseDto>;

  abstract create(createVehicle: CreateVehicleDto): Promise<void>;

  abstract update(id: number, updateVehicle: UpdateVehicleDto): Promise<void>;

  abstract delete(id: number): Promise<void>;
}
