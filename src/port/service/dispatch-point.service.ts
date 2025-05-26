import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/create-dispatch-point.dto';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { UpdateDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/update-dispatch-point.dto';
import { DispatchPointResponseDto } from '@/adapter/inbound/dto/response/dispatch-point/dispatch-point-response.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { DispatchPointServiceInPort } from '@/port/inbound/dispatch-point-service.in-port';
import { DispatchPointServiceOutPort } from '@/port/outbound/dispatch-point-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class DispatchPointService implements DispatchPointServiceInPort {
  constructor(private readonly dispatchPointServiceOutPort: DispatchPointServiceOutPort) {}

  async search(
    searchDispatchPoint: SearchDispatchPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<DispatchPointResponseDto>> {
    const [dispatchPoints, totalCount] = await this.dispatchPointServiceOutPort.findAll(searchDispatchPoint, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(DispatchPointResponseDto, dispatchPoints, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<DispatchPointResponseDto> {
    const dispatchPoint = await this.dispatchPointServiceOutPort.findById(id);
    return plainToInstance(DispatchPointResponseDto, dispatchPoint, classTransformDefaultOptions);
  }

  async create(createDispatchPoint: CreateDispatchPointDto): Promise<void> {
    const dispatchPoint = plainToInstance(DispatchPoint, createDispatchPoint);
    await this.dispatchPointServiceOutPort.save(dispatchPoint);
  }

  async update(id: number, updateDispatchPoint: UpdateDispatchPointDto): Promise<void> {
    await this.dispatchPointServiceOutPort.update(id, updateDispatchPoint);
  }

  async delete(id: number): Promise<void> {
    await this.dispatchPointServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
