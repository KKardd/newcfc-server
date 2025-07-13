import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';

@Injectable()
export class VehicleRepository implements VehicleServiceOutPort {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async findAll(search: SearchVehicleDto, paginationQuery: PaginationQuery, status?: string): Promise<[Vehicle[], number]> {
    const where: any = {};
    if (search.vehicleNumber) where.vehicleNumber = Like(`%${search.vehicleNumber}%`);
    if (search.modelName) where.modelName = Like(`%${search.modelName}%`);
    if (search.garageId) where.garageId = search.garageId;
    if (search.vehicleStatus) where.vehicleStatus = search.vehicleStatus;
    if (search.assigned !== undefined) {
      // 할당 여부는 별도 쿼리 필요, 여기서는 단순화
    }
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.vehicleRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
      relations: ['garage'],
    });
  }

  async findById(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({ where: { id }, relations: ['garage'] });
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return this.vehicleRepository.save(vehicle);
  }

  async update(id: number, vehicle: Partial<Vehicle>) {
    return this.vehicleRepository.update(id, vehicle);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.vehicleRepository.update(id, { status });
  }

  async findUnassignedVehicles(): Promise<Vehicle[]> {
    // 실제 구현 필요
    return [];
  }
}
