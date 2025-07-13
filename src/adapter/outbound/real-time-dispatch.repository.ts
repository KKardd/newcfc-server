import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';

@Injectable()
export class RealTimeDispatchRepository implements RealTimeDispatchServiceOutPort {
  constructor(
    @InjectRepository(RealTimeDispatch)
    private readonly realTimeDispatchRepository: Repository<RealTimeDispatch>,
  ) {}

  async findAll(
    search: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[RealTimeDispatch[], number]> {
    const where: any = {};
    if (search.departureName) where.departureName = Like(`%${search.departureName}%`);
    if (search.departureAddress) where.departureAddress = Like(`%${search.departureAddress}%`);
    if (search.destinationName) where.destinationName = Like(`%${search.destinationName}%`);
    if (search.destinationAddress) where.destinationAddress = Like(`%${search.destinationAddress}%`);
    if (search.departureAddressDetail) where.departureAddressDetail = Like(`%${search.departureAddressDetail}%`);
    if (search.destinationAddressDetail) where.destinationAddressDetail = Like(`%${search.destinationAddressDetail}%`);
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    return this.realTimeDispatchRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<RealTimeDispatch | null> {
    return this.realTimeDispatchRepository.findOne({ where: { id } });
  }

  async save(realTimeDispatch: RealTimeDispatch): Promise<RealTimeDispatch> {
    return this.realTimeDispatchRepository.save(realTimeDispatch);
  }

  async update(id: number, realTimeDispatch: Partial<RealTimeDispatch>) {
    return this.realTimeDispatchRepository.update(id, realTimeDispatch);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.realTimeDispatchRepository.update(id, { status });
  }
}
