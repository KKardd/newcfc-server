import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPointResponseDto } from '@/adapter/inbound/dto/response/dispatch-point/dispatch-point-response.dto';
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
  ): Promise<[DispatchPointResponseDto[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('dispatch_point').select('dispatch_point.*');

    if (searchDispatchPoint.name) {
      queryBuilder.andWhere('dispatch_point.name LIKE :name', {
        name: `%${searchDispatchPoint.name}%`,
      });
    }

    if (searchDispatchPoint.address) {
      queryBuilder.andWhere('dispatch_point.address LIKE :address', {
        address: `%${searchDispatchPoint.address}%`,
      });
    }

    if (searchDispatchPoint.status) {
      queryBuilder.andWhere('dispatch_point.status = :status', {
        status: searchDispatchPoint.status,
      });
    }

    queryBuilder.orderBy('dispatch_point.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const dispatchPoints = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const dispatchPointsResponse: DispatchPointResponseDto[] = dispatchPoints.map((dispatchPoint) => ({
      id: dispatchPoint.id,
      name: dispatchPoint.name,
      address: dispatchPoint.address,
      latitude: dispatchPoint.latitude,
      longitude: dispatchPoint.longitude,
      status: dispatchPoint.status,
      createdAt: dispatchPoint.created_at,
      updatedAt: dispatchPoint.updated_at,
    }));

    return [dispatchPointsResponse, totalCount];
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
