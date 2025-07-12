import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { DispatchPointServiceOutPort } from '@/port/outbound/dispatch-point-service.out-port';

@Injectable()
export class DispatchPointRepository implements DispatchPointServiceOutPort {
  constructor(
    @InjectRepository(DispatchPoint)
    private readonly dispatchPointRepository: Repository<DispatchPoint>,
  ) {}

  async findAll(
    search: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[DispatchPoint[], number]> {
    const where: any = {};
    if (search.name) where.name = Like(`%${search.name}%`);
    if (search.address) where.address = Like(`%${search.address}%`);
    if (status === 'delete') {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.dispatchPointRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<DispatchPoint | null> {
    return this.dispatchPointRepository.findOne({ where: { id } });
  }

  async save(dispatchPoint: DispatchPoint): Promise<DispatchPoint> {
    return this.dispatchPointRepository.save(dispatchPoint);
  }

  async update(id: number, dispatchPoint: Partial<DispatchPoint>) {
    return this.dispatchPointRepository.update(id, dispatchPoint);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.dispatchPointRepository.update(id, { status });
  }
}
