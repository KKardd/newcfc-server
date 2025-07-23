import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Not, Like, UpdateResult } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchVehicleDto } from '@/adapter/inbound/dto/request/vehicle/search-vehicle.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { convertKstToUtc } from '@/util/date';

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
        // boolean 또는 string으로 전달될 수 있으므로 명시적으로 비교
        const isAssignedFilter = search.assigned === true || search.assigned === 'true';
        const isUnassignedFilter = search.assigned === false || search.assigned === 'false';

        if (isAssignedFilter) {
          // 배정된 차량만 조회 (기사가 배정되어 있는 차량)
          queryBuilder.andWhere(
            `EXISTS (
            SELECT 1 FROM chauffeur c
            WHERE c.vehicle_id = vehicle.id
            AND c.status != :chauffeurDeletedStatus
          )`,
            { chauffeurDeletedStatus: DataStatus.DELETED },
          );
        } else if (isUnassignedFilter) {
          // 미배정 차량만 조회 (기사가 배정되지 않은 차량)
          queryBuilder.andWhere(
            `NOT EXISTS (
            SELECT 1 FROM chauffeur c
            WHERE c.vehicle_id = vehicle.id
            AND c.status != :chauffeurDeletedStatus
          )`,
            { chauffeurDeletedStatus: DataStatus.DELETED },
          );
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
      .leftJoinAndMapOne(
        'vehicle.chauffeur',
        'chauffeur',
        'chauffeur',
        'chauffeur.vehicle_id = vehicle.id AND chauffeur.status != :chauffeurDeletedStatus',
        { chauffeurDeletedStatus: DataStatus.DELETED },
      )
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
    return await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.status != :vehicleDeletedStatus', { vehicleDeletedStatus: DataStatus.DELETED })
      .andWhere('vehicle.vehicleStatus = :normalStatus', { normalStatus: VehicleStatus.NORMAL })
      .andWhere(
        `vehicle.id NOT IN (
          SELECT DISTINCT c.vehicle_id
          FROM chauffeur c
          WHERE c.vehicle_id IS NOT NULL
          AND c.status != :chauffeurDeletedStatus
          AND c.is_vehicle_assigned = true
        )`,
        { chauffeurDeletedStatus: DataStatus.DELETED },
      )
      .getMany();
  }

  async countByGarageId(garageId: number): Promise<number> {
    return this.vehicleRepository.count({
      where: {
        garageId,
        status: Not(DataStatus.DELETED),
      },
    });
  }

  async findAvailableVehiclesForReservation(startTime: Date, endTime: Date): Promise<Vehicle[]> {
    // KST 시간을 UTC로 변환
    const startTimeUtc = convertKstToUtc(startTime);
    const endTimeUtc = convertKstToUtc(endTime);

    // 1. 해당 시간대에 운행이 있는 차량들의 ID를 조회
    const busyVehicleIds = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .innerJoin('operation', 'o', 'vehicle.id = o.vehicle_id')
      .select('vehicle.id', 'id')
      .where('o.vehicle_id IS NOT NULL')
      .andWhere('o.status != :deletedStatus', { deletedStatus: DataStatus.DELETED })
      .andWhere('((o.start_time <= :endTime AND o.end_time >= :startTime) OR (o.start_time IS NULL OR o.end_time IS NULL))', {
        startTime: startTimeUtc,
        endTime: endTimeUtc,
      })
      .getRawMany();

    const busyIds = busyVehicleIds.map((row) => row.id);

    // 2. 사용 가능한 모든 차량들을 조회
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.status != :deletedStatus', { deletedStatus: DataStatus.DELETED })
      .andWhere('vehicle.vehicleStatus = :normalStatus', { normalStatus: VehicleStatus.NORMAL });

    // busyIds가 있으면 제외
    if (busyIds.length > 0) {
      query.andWhere('vehicle.id NOT IN (:...busyIds)', { busyIds });
    }

    return await query.getMany();
  }
}
