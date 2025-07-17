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
    // 기본 쿼리 빌더 생성
    const createBaseQuery = () => {
      const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle');
      
      // 기본 검색 조건들
      if (search.vehicleNumber) {
        queryBuilder.andWhere('vehicle.vehicleNumber LIKE :vehicleNumber', {
          vehicleNumber: `%${search.vehicleNumber}%`,
        });
      }

      if (search.modelName) {
        queryBuilder.andWhere('vehicle.modelName LIKE :modelName', {
          modelName: `%${search.modelName}%`,
        });
      }

      if (search.garageId) {
        queryBuilder.andWhere('vehicle.garageId = :garageId', {
          garageId: search.garageId,
        });
      }

      if (search.vehicleStatus) {
        queryBuilder.andWhere('vehicle.vehicleStatus = :vehicleStatus', {
          vehicleStatus: search.vehicleStatus,
        });
      }

      // 상태 필터링
      if (status === DataStatus.DELETED) {
        queryBuilder.andWhere('vehicle.status != :deleteStatus', { deleteStatus: DataStatus.DELETED });
      } else if (status) {
        queryBuilder.andWhere('vehicle.status = :statusParam', { statusParam: status });
      }

      return queryBuilder;
    };

    // 배정 여부 필터링을 위한 서브쿼리 생성
    const applyAssignedFilter = (queryBuilder: any) => {
      if (search.assigned !== undefined) {
        console.log('DEBUG: assigned filter value:', search.assigned, 'type:', typeof search.assigned);
        if (search.assigned) {
          // 배정된 차량만 조회 (기사가 배정되어 있는 차량)
          queryBuilder.andWhere(`EXISTS (
            SELECT 1 FROM chauffeur c 
            WHERE c.vehicle_id = vehicle.id 
            AND c.status != :chauffeurDeletedStatus
          )`, { chauffeurDeletedStatus: DataStatus.DELETED });
        } else {
          // 미배정 차량만 조회 (기사가 배정되지 않은 차량)
          queryBuilder.andWhere(`NOT EXISTS (
            SELECT 1 FROM chauffeur c 
            WHERE c.vehicle_id = vehicle.id 
            AND c.status != :chauffeurDeletedStatus
          )`, { chauffeurDeletedStatus: DataStatus.DELETED });
        }
      }
    };

    // COUNT 쿼리 실행
    const countQueryBuilder = createBaseQuery();
    applyAssignedFilter(countQueryBuilder);
    const totalCount = await countQueryBuilder.getCount();

    // SELECT 쿼리 실행 (관계 매핑 포함)
    const selectQueryBuilder = createBaseQuery()
      .leftJoinAndMapOne('vehicle.garage', 'garage', 'garage', 'garage.id = vehicle.garage_id')
      .leftJoinAndMapOne('vehicle.chauffeur', 'chauffeur', 'chauffeur', 'chauffeur.vehicle_id = vehicle.id AND chauffeur.status != :chauffeurDeletedStatus', { chauffeurDeletedStatus: DataStatus.DELETED })
      .orderBy('vehicle.created_at', 'DESC')
      .offset(paginationQuery.skip)
      .limit(paginationQuery.countPerPage);

    applyAssignedFilter(selectQueryBuilder);
    const vehicles = await selectQueryBuilder.getMany();

    return [vehicles, totalCount];
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
