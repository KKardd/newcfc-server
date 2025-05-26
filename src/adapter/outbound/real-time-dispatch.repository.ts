import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';

@Injectable()
export class RealTimeDispatchRepository implements RealTimeDispatchServiceOutPort {
  constructor(
    @InjectRepository(RealTimeDispatch)
    private readonly repository: Repository<RealTimeDispatch>,
  ) {}

  async findAll(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<[RealTimeDispatch[], number]> {
    const query = this.repository.createQueryBuilder('realTimeDispatch');

    if (searchRealTimeDispatch.name) {
      query.andWhere('realTimeDispatch.name LIKE :name', {
        name: `%${searchRealTimeDispatch.name}%`,
      });
    }

    if (searchRealTimeDispatch.description) {
      query.andWhere('realTimeDispatch.description LIKE :description', {
        description: `%${searchRealTimeDispatch.description}%`,
      });
    }

    if (searchRealTimeDispatch.departureAddress) {
      query.andWhere('realTimeDispatch.departureAddress LIKE :departureAddress', {
        departureAddress: `%${searchRealTimeDispatch.departureAddress}%`,
      });
    }

    if (searchRealTimeDispatch.destinationAddress) {
      query.andWhere('realTimeDispatch.destinationAddress LIKE :destinationAddress', {
        destinationAddress: `%${searchRealTimeDispatch.destinationAddress}%`,
      });
    }

    if (searchRealTimeDispatch.status) {
      query.andWhere('realTimeDispatch.status = :status', {
        status: searchRealTimeDispatch.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
  }

  async findById(id: number): Promise<RealTimeDispatch> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(realTimeDispatch: RealTimeDispatch): Promise<void> {
    await this.repository.save(realTimeDispatch);
  }

  async update(id: number, realTimeDispatch: Partial<RealTimeDispatch>): Promise<void> {
    await this.repository.update(id, realTimeDispatch);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
