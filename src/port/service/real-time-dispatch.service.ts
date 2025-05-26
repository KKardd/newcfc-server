import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/create-real-time-dispatch.dto';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { UpdateRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/update-real-time-dispatch.dto';
import { RealTimeDispatchResponseDto } from '@/adapter/inbound/dto/response/real-time-dispatch/real-time-dispatch-response.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { RealTimeDispatchServiceInPort } from '@/port/inbound/real-time-dispatch-service.in-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class RealTimeDispatchService implements RealTimeDispatchServiceInPort {
  constructor(private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort) {}

  async search(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<RealTimeDispatchResponseDto>> {
    const [realTimeDispatches, totalCount] = await this.realTimeDispatchServiceOutPort.findAll(
      searchRealTimeDispatch,
      paginationQuery,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(RealTimeDispatchResponseDto, realTimeDispatches, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<RealTimeDispatchResponseDto> {
    const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(id);
    return plainToInstance(RealTimeDispatchResponseDto, realTimeDispatch, classTransformDefaultOptions);
  }

  async create(createRealTimeDispatch: CreateRealTimeDispatchDto): Promise<void> {
    const realTimeDispatch = plainToInstance(RealTimeDispatch, createRealTimeDispatch);
    await this.realTimeDispatchServiceOutPort.save(realTimeDispatch);
  }

  async update(id: number, updateRealTimeDispatch: UpdateRealTimeDispatchDto): Promise<void> {
    await this.realTimeDispatchServiceOutPort.update(id, updateRealTimeDispatch);
  }

  async delete(id: number): Promise<void> {
    await this.realTimeDispatchServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
