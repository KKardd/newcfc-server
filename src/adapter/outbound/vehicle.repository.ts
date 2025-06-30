import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { VehicleResponseDto } from '@/adapter/inbound/dto/response/vehicle/vehicle-response.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';

@Injectable()
export class VehicleRepository implements VehicleServiceOutPort {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async findAll(searchVehicle: SearchVehicleDto, paginationQuery: PaginationQuery): Promise<[VehicleResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('vehicle')
      .innerJoin('garage', 'garage', 'vehicle.garageId = garage.id')
      .select('vehicle.*')
      .addSelect('garage.id', 'garage_id')
      .addSelect('garage.name', 'garage_name')
      .addSelect('garage.address', 'garage_address')
      .addSelect('garage.status', 'garage_status')
      .addSelect('garage.created_by', 'garage_created_by')
      .addSelect('garage.created_at', 'garage_created_at')
      .addSelect('garage.updated_by', 'garage_updated_by')
      .addSelect('garage.updated_at', 'garage_updated_at');

    if (searchVehicle.vehicleNumber) {
      queryBuilder.andWhere('vehicle.vehicle_number LIKE :vehicleNumber', {
        vehicleNumber: `%${searchVehicle.vehicleNumber}%`,
      });
    }

    if (searchVehicle.modelName) {
      queryBuilder.andWhere('vehicle.model_name LIKE :modelName', {
        modelName: `%${searchVehicle.modelName}%`,
      });
    }

    if (searchVehicle.garageId) {
      queryBuilder.andWhere('vehicle.garage_id = :garageId', {
        garageId: searchVehicle.garageId,
      });
    }

    if (searchVehicle.vehicleStatus) {
      queryBuilder.andWhere('vehicle.vehicle_status = :vehicleStatus', {
        vehicleStatus: searchVehicle.vehicleStatus,
      });
    }

    if (searchVehicle.status) {
      queryBuilder.andWhere('vehicle.status = :status', {
        status: searchVehicle.status,
      });
    }

    queryBuilder.orderBy('vehicle.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const vehicles = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const vehiclesResponse: VehicleResponseDto[] = vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicle_number,
      modelName: vehicle.model_name,
      garageId: vehicle.garage_id,
      vehicleStatus: vehicle.vehicle_status,
      status: vehicle.status,
      createdBy: vehicle.created_by,
      createdAt: vehicle.created_at,
      updatedBy: vehicle.updated_by,
      updatedAt: vehicle.updated_at,
      // Garage 정보
      garage: {
        id: vehicle.garage_id,
        name: vehicle.garage_name,
        address: vehicle.garage_address,
        status: vehicle.garage_status,
        createdBy: vehicle.garage_created_by,
        createdAt: vehicle.garage_created_at,
        updatedBy: vehicle.garage_updated_by,
        updatedAt: vehicle.garage_updated_at,
      },
    }));

    return [vehiclesResponse, totalCount];
  }

  async findById(id: number): Promise<Vehicle> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(vehicle: Vehicle): Promise<void> {
    await this.repository.save(vehicle);
  }

  async update(id: number, vehicle: Partial<Vehicle>): Promise<void> {
    await this.repository.update(id, vehicle);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
