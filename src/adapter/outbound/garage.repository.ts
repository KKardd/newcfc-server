import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { GarageResponseDto } from '@/adapter/inbound/dto/response/garage/garage-response.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';

@Injectable()
export class GarageRepository implements GarageServiceOutPort {
  constructor(
    @InjectRepository(Garage)
    private readonly repository: Repository<Garage>,
  ) {}

  async findAll(searchGarage: SearchGarageDto, paginationQuery: PaginationQuery): Promise<[GarageResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('garage')
      .leftJoin('vehicle', 'vehicle', "garage.id = vehicle.garageId AND vehicle.status != 'DELETED'")
      .select('garage.*')
      .addSelect('COUNT(vehicle.id)', 'vehicle_count')
      .groupBy('garage.id');

    if (searchGarage.name) {
      queryBuilder.andWhere('garage.name LIKE :name', {
        name: `%${searchGarage.name}%`,
      });
    }

    if (searchGarage.address) {
      queryBuilder.andWhere('garage.address LIKE :address', {
        address: `%${searchGarage.address}%`,
      });
    }

    if (searchGarage.status) {
      queryBuilder.andWhere('garage.status = :status', {
        status: searchGarage.status,
      });
    }

    queryBuilder.orderBy('garage.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const garages = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const garagesResponse: GarageResponseDto[] = garages.map((garage) => ({
      id: garage.id,
      name: garage.name,
      address: garage.address,
      vehicleCount: parseInt(garage.vehicle_count) || 0,
      status: garage.status,
      createdAt: garage.created_at,
      updatedAt: garage.updated_at,
    }));

    return [garagesResponse, totalCount];
  }

  async findById(id: number): Promise<Garage> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async findByIdWithVehicleCount(id: number): Promise<GarageResponseDto> {
    const result = await this.repository
      .createQueryBuilder('garage')
      .leftJoin('vehicle', 'vehicle', "garage.id = vehicle.garageId AND vehicle.status != 'DELETED'")
      .select('garage.*')
      .addSelect('COUNT(vehicle.id)', 'vehicle_count')
      .where('garage.id = :id', { id })
      .groupBy('garage.id')
      .getRawOne();

    if (!result) {
      throw new Error('Garage not found');
    }

    return {
      id: result.id,
      name: result.name,
      address: result.address,
      vehicleCount: parseInt(result.vehicle_count) || 0,
      status: result.status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  async save(garage: Garage): Promise<void> {
    await this.repository.save(garage);
  }

  async update(id: number, garage: Partial<Garage>): Promise<void> {
    await this.repository.update(id, garage);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
