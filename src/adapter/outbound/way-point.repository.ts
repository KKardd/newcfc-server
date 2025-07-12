import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
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

  async findAll(search: SearchWayPointDto, paginationQuery: PaginationQuery, status?: string): Promise<[WayPoint[], number]> {
    const where: any = {};
    if (search.operationId) where.operationId = search.operationId;
    if (search.address) where.address = Like(`%${search.address}%`);
    if (status === 'delete') {
      where.status = Not('delete');
    } else if (status) {
      where.status = status;
    }
    return this.wayPointRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { order: 'ASC' },
      where,
    });
  }

  async findById(id: number): Promise<WayPoint | null> {
    return this.wayPointRepository.findOne({ where: { id } });
  }

  async save(wayPoint: WayPoint): Promise<WayPoint> {
    return this.wayPointRepository.save(wayPoint);
  }

  async update(id: number, wayPoint: Partial<WayPoint>) {
    return this.wayPointRepository.update(id, wayPoint);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.wayPointRepository.update(id, { status });
  }
}
