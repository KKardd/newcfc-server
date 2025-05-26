import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/create-vehicle.dto';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { UpdateVehicleDto } from '@/adapter/inbound/dto/request/vehicle/update-vehicle.dto';
import { VehicleResponseDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceInPort } from '@/port/inbound/vehicle-service.in-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class VehicleService implements VehicleServiceInPort {
  constructor(private readonly vehicleServiceOutPort: VehicleServiceOutPort) {}

  async search(
    searchVehicle: SearchVehicleDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<VehicleResponseDto>> {
    const [vehicles, totalCount] = await this.vehicleServiceOutPort.findAll(searchVehicle, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(VehicleResponseDto, vehicles, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleServiceOutPort.findById(id);
    return plainToInstance(VehicleResponseDto, vehicle, classTransformDefaultOptions);
  }

  async create(createVehicle: CreateVehicleDto): Promise<void> {
    const vehicle = plainToInstance(Vehicle, createVehicle);
    await this.vehicleServiceOutPort.save(vehicle);
  }

  async update(id: number, updateVehicle: UpdateVehicleDto): Promise<void> {
    await this.vehicleServiceOutPort.update(id, updateVehicle);
  }

  async delete(id: number): Promise<void> {
    await this.vehicleServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
