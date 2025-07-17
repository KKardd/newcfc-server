import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { UpdateResult } from 'typeorm';

@Injectable()
export class VehicleRepository implements VehicleServiceOutPort {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
  ) {}

  async findAll(search: SearchVehicleDto, paginationQuery: PaginationQuery, status?: string): Promise<[Vehicle[], number]> {
    const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle')
      .leftJoin('garage', 'garage', 'garage.id = vehicle.garage_id')
      .leftJoin('chauffeur', 'chauffeur', 'chauffeur.vehicle_id = vehicle.id AND chauffeur.status != :chauffeurDeletedStatus', { chauffeurDeletedStatus: DataStatus.DELETED })
      .addSelect([
        'garage.id',
        'garage.name', 
        'garage.address',
        'garage.address_detail',
        'garage.status',
        'garage.created_by',
        'garage.created_at',
        'garage.updated_by',
        'garage.updated_at'
      ])
      .addSelect([
        'chauffeur.id',
        'chauffeur.name',
        'chauffeur.phone',
        'chauffeur.birth_date',
        'chauffeur.profile_image_url',
        'chauffeur.type',
        'chauffeur.is_vehicle_assigned',
        'chauffeur.chauffeur_status',
        'chauffeur.role',
        'chauffeur.status',
        'chauffeur.created_by',
        'chauffeur.created_at',
        'chauffeur.updated_by',
        'chauffeur.updated_at'
      ]);

    // 기본 검색 조건들
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

    // 배정 여부 필터링
    if (search.assigned !== undefined) {
      if (search.assigned) {
        // 배정된 차량만 조회 (기사가 배정되어 있는 차량)
        queryBuilder.andWhere('chauffeur.id IS NOT NULL');
      } else {
        // 미배정 차량만 조회 (기사가 배정되지 않은 차량)
        queryBuilder.andWhere('chauffeur.id IS NULL');
      }
    }

    // 상태 필터링
    if (status === DataStatus.DELETED) {
      queryBuilder.andWhere('vehicle.status != :deleteStatus', { deleteStatus: DataStatus.DELETED });
    } else if (status) {
      queryBuilder.andWhere('vehicle.status = :statusParam', { statusParam: status });
    }

    queryBuilder.orderBy('vehicle.created_at', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({ where: { id } });
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

  async countByGarageId(garageId: number): Promise<number> {
    return this.vehicleRepository.count({
      where: {
        garageId,
        status: Not(DataStatus.DELETED),
      },
    });
  }
}
