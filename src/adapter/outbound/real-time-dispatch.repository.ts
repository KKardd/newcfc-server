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
    const queryBuilder = this.repository
      .createQueryBuilder('real_time_dispatch')
      .leftJoin('operation', 'operation', 'real_time_dispatch.id = operation.real_time_dispatch_id')
      .leftJoin('chauffeur', 'chauffeur', "operation.chauffeur_id = chauffeur.id AND chauffeur.status != 'DELETED'")
      .select('real_time_dispatch.*')
      .addSelect('COUNT(chauffeur.id)', 'chauffeur_count')
      .where('real_time_dispatch.status != :deletedStatus', { deletedStatus: DataStatus.DELETED })
      .groupBy('real_time_dispatch.id');

    if (searchRealTimeDispatch.departureName) {
      queryBuilder.andWhere('real_time_dispatch.departure_name LIKE :departureName', {
        departureName: `%${searchRealTimeDispatch.departureName}%`,
      });
    }

    if (searchRealTimeDispatch.departureAddress) {
      queryBuilder.andWhere('real_time_dispatch.departure_address LIKE :departureAddress', {
        departureAddress: `%${searchRealTimeDispatch.departureAddress}%`,
      });
    }

    if (searchRealTimeDispatch.destinationName) {
      queryBuilder.andWhere('real_time_dispatch.destination_name LIKE :destinationName', {
        destinationName: `%${searchRealTimeDispatch.destinationName}%`,
      });
    }

    if (searchRealTimeDispatch.destinationAddress) {
      queryBuilder.andWhere('real_time_dispatch.destination_address LIKE :destinationAddress', {
        destinationAddress: `%${searchRealTimeDispatch.destinationAddress}%`,
      });
    }

    if (searchRealTimeDispatch.departureAddressDetail) {
      queryBuilder.andWhere('real_time_dispatch.departure_address_detail LIKE :departureAddressDetail', {
        departureAddressDetail: `%${searchRealTimeDispatch.departureAddressDetail}%`,
      });
    }

    if (searchRealTimeDispatch.destinationAddressDetail) {
      queryBuilder.andWhere('real_time_dispatch.destination_address_detail LIKE :destinationAddressDetail', {
        destinationAddressDetail: `%${searchRealTimeDispatch.destinationAddressDetail}%`,
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
      departureName: dispatch.departure_name,
      departureAddress: dispatch.departure_address,
      departureAddressDetail: dispatch.departure_address_detail,
      destinationName: dispatch.destination_name,
      destinationAddress: dispatch.destination_address,
      destinationAddressDetail: dispatch.destination_address_detail,
      chauffeurCount: parseInt(dispatch.chauffeur_count) || 0,
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
