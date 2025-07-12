import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Vehicle)
export class VehicleRepository extends BaseRepository<Vehicle> implements VehicleServiceOutPort {
  async findAll(search: SearchVehicleDto, paginationQuery: PaginationQuery): Promise<[Vehicle[], number]> {
    const queryBuilder = this.createQueryBuilder('vehicle').leftJoinAndSelect('vehicle.garage', 'garage');

    if (search.vehicleNumber) {
      queryBuilder.andWhere('vehicle.vehicle_number LIKE :vehicleNumber', {
        vehicleNumber: `%${search.vehicleNumber}%`,
      });
    }

    if (search.modelName) {
      queryBuilder.andWhere('vehicle.model_name LIKE :modelName', {
        modelName: `%${search.modelName}%`,
      });
    }

    if (search.garageId) {
      queryBuilder.andWhere('vehicle.garage_id = :garageId', {
        garageId: search.garageId,
      });
    }

    if (search.vehicleStatus) {
      queryBuilder.andWhere('vehicle.vehicle_status = :vehicleStatus', {
        vehicleStatus: search.vehicleStatus,
      });
    }

    if (search.assigned !== undefined) {
      if (search.assigned) {
        queryBuilder.andWhere('chauffeur.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('chauffeur.id IS NULL');
      }
    }

    if (search.status) {
      queryBuilder.andWhere('vehicle.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('vehicle.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Vehicle> {
    return this.findOneOrFail({
      where: { id },
      relations: ['garage'],
    });
  }

  async update(id: number, vehicle: Partial<Vehicle>): Promise<UpdateResult> {
    return await super.update(id, vehicle);
  }

  async updateStatus(id: number, status: DataStatus): Promise<UpdateResult> {
    return await this.update(id, { status });
  }

  async findUnassignedVehicles(): Promise<Vehicle[]> {
    return this.createQueryBuilder('vehicle')
      .leftJoin('chauffeur', 'chauffeur', 'vehicle.id = chauffeur.vehicleId')
      .where('chauffeur.id IS NULL')
      .getMany();
  }
}
