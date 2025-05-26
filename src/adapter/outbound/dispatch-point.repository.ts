import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { DispatchPointServiceOutPort } from '@/port/outbound/dispatch-point-service.out-port';

@Injectable()
export class DispatchPointRepository implements DispatchPointServiceOutPort {
  constructor(
    @InjectRepository(DispatchPoint)
    private readonly repository: Repository<DispatchPoint>,
  ) {}

  async findAll(
    searchDispatchPoint: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<[DispatchPoint[], number]> {
    const query = this.repository.createQueryBuilder('dispatchPoint');

    if (searchDispatchPoint.name) {
      query.andWhere('dispatchPoint.name LIKE :name', {
        name: `%${searchDispatchPoint.name}%`,
      });
    }

    if (searchDispatchPoint.address) {
      query.andWhere('dispatchPoint.address LIKE :address', {
        address: `%${searchDispatchPoint.address}%`,
      });
    }

    if (searchDispatchPoint.status) {
      query.andWhere('dispatchPoint.status = :status', {
        status: searchDispatchPoint.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
  }

  async findById(id: number): Promise<DispatchPoint> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(dispatchPoint: DispatchPoint): Promise<void> {
    await this.repository.save(dispatchPoint);
  }

  async update(id: number, dispatchPoint: Partial<DispatchPoint>): Promise<void> {
    await this.repository.update(id, dispatchPoint);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
