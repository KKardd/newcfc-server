import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';

@Injectable()
export class VehicleRepository implements VehicleServiceOutPort {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async findAll(searchVehicle: SearchVehicleDto, paginationQuery: PaginationQuery): Promise<[Vehicle[], number]> {
    const query = this.repository.createQueryBuilder('vehicle');

    if (searchVehicle.vehicleNumber) {
      query.andWhere('vehicle.vehicleNumber LIKE :vehicleNumber', {
        vehicleNumber: `%${searchVehicle.vehicleNumber}%`,
      });
    }

    if (searchVehicle.modelName) {
      query.andWhere('vehicle.modelName LIKE :modelName', {
        modelName: `%${searchVehicle.modelName}%`,
      });
    }

    if (searchVehicle.garageId) {
      query.andWhere('vehicle.garageId = :garageId', {
        garageId: searchVehicle.garageId,
      });
    }

    if (searchVehicle.vehicleStatus) {
      query.andWhere('vehicle.vehicleStatus = :vehicleStatus', {
        vehicleStatus: searchVehicle.vehicleStatus,
      });
    }

    if (searchVehicle.status) {
      query.andWhere('vehicle.status = :status', {
        status: searchVehicle.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
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
