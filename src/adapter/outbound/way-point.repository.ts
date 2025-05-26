import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';

@Injectable()
export class WayPointRepository implements WayPointServiceOutPort {
  constructor(
    @InjectRepository(WayPoint)
    private readonly wayPointRepository: Repository<WayPoint>,
  ) {}

  async findAll(searchWayPoint: SearchWayPointDto, paginationQuery: PaginationQuery): Promise<[WayPoint[], number]> {
    const query = this.wayPointRepository.createQueryBuilder('wayPoint');

    if (searchWayPoint.reservationId) {
      query.andWhere('wayPoint.reservationId = :reservationId', { reservationId: searchWayPoint.reservationId });
    }

    if (searchWayPoint.address) {
      query.andWhere('wayPoint.address LIKE :address', { address: `%${searchWayPoint.address}%` });
    }

    if (searchWayPoint.order) {
      query.andWhere('wayPoint.order = :order', { order: searchWayPoint.order });
    }

    if (searchWayPoint.status) {
      query.andWhere('wayPoint.status = :status', { status: searchWayPoint.status });
    }

    query.skip(paginationQuery.skip);
    query.take(paginationQuery.countPerPage);

    return query.getManyAndCount();
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
