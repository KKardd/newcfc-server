import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatchResponseDto } from '@/adapter/inbound/dto/response/real-time-dispatch/real-time-dispatch-response.dto';
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
  ): Promise<[RealTimeDispatchResponseDto[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('real_time_dispatch').select('real_time_dispatch.*');

    if (searchRealTimeDispatch.name) {
      queryBuilder.andWhere('real_time_dispatch.name LIKE :name', {
        name: `%${searchRealTimeDispatch.name}%`,
      });
    }

    if (searchRealTimeDispatch.description) {
      queryBuilder.andWhere('real_time_dispatch.description LIKE :description', {
        description: `%${searchRealTimeDispatch.description}%`,
      });
    }

    if (searchRealTimeDispatch.departureAddress) {
      queryBuilder.andWhere('real_time_dispatch.departure_address LIKE :departureAddress', {
        departureAddress: `%${searchRealTimeDispatch.departureAddress}%`,
      });
    }

    if (searchRealTimeDispatch.destinationAddress) {
      queryBuilder.andWhere('real_time_dispatch.destination_address LIKE :destinationAddress', {
        destinationAddress: `%${searchRealTimeDispatch.destinationAddress}%`,
      });
    }

    if (searchRealTimeDispatch.status) {
      queryBuilder.andWhere('real_time_dispatch.status = :status', {
        status: searchRealTimeDispatch.status,
      });
    }

    queryBuilder.orderBy('real_time_dispatch.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const realTimeDispatches = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const realTimeDispatchesResponse: RealTimeDispatchResponseDto[] = realTimeDispatches.map((dispatch) => ({
      id: dispatch.id,
      name: dispatch.name,
      description: dispatch.description,
      departureAddress: dispatch.departure_address,
      destinationAddress: dispatch.destination_address,
      status: dispatch.status,
      createdAt: dispatch.created_at,
      updatedAt: dispatch.updated_at,
    }));

    return [realTimeDispatchesResponse, totalCount];
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
