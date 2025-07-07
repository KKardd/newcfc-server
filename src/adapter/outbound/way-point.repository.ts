import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { WayPointResponseDto } from '@/adapter/inbound/dto/response/way-point/way-point-response.dto';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';

@Injectable()
export class WayPointRepository implements WayPointServiceOutPort {
  constructor(
    @InjectRepository(WayPoint)
    private readonly wayPointRepository: Repository<WayPoint>,
  ) {}

  async findAll(searchWayPoint: SearchWayPointDto, paginationQuery: PaginationQuery): Promise<[WayPointResponseDto[], number]> {
    const queryBuilder = this.wayPointRepository.createQueryBuilder('way_point').select('way_point.*');

    if (searchWayPoint.operationId) {
      queryBuilder.andWhere('way_point.operation_id = :operationId', { operationId: searchWayPoint.operationId });
    }

    if (searchWayPoint.address) {
      queryBuilder.andWhere('way_point.address LIKE :address', { address: `%${searchWayPoint.address}%` });
    }

    if (searchWayPoint.order) {
      queryBuilder.andWhere('way_point.order = :order', { order: searchWayPoint.order });
    }

    if (searchWayPoint.status) {
      queryBuilder.andWhere('way_point.status = :status', { status: searchWayPoint.status });
    }

    queryBuilder.orderBy('way_point.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const wayPoints = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const wayPointsResponse: WayPointResponseDto[] = wayPoints.map((wayPoint) => ({
      id: wayPoint.id,
      operationId: wayPoint.operation_id,
      name: wayPoint.name,
      address: wayPoint.address,
      addressDetail: wayPoint.address_detail,
      chauffeurStatus: wayPoint.chauffeur_status,
      latitude: wayPoint.latitude,
      longitude: wayPoint.longitude,
      visitTime: wayPoint.visit_time,
      order: wayPoint.order,
      status: wayPoint.status,
      createdBy: wayPoint.created_by,
      createdAt: wayPoint.created_at,
      updatedBy: wayPoint.updated_by,
      updatedAt: wayPoint.updated_at,
    }));

    return [wayPointsResponse, totalCount];
  }

  async findById(id: number): Promise<WayPoint | null> {
    return this.wayPointRepository.findOne({ where: { id } });
  }

  async save(wayPoint: WayPoint): Promise<void> {
    await this.wayPointRepository.save(wayPoint);
  }

  async update(id: number, wayPoint: Partial<WayPoint>): Promise<void> {
    await this.wayPointRepository.update(id, wayPoint);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.wayPointRepository.update(id, { status });
  }
}
