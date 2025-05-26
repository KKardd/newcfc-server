import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class OperationService implements OperationServiceInPort {
  constructor(private readonly operationServiceOutPort: OperationServiceOutPort) {}

  async search(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>> {
    const [operations, totalCount] = await this.operationServiceOutPort.findAll(searchOperation, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(OperationResponseDto, operations, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<OperationResponseDto> {
    const operation = await this.operationServiceOutPort.findById(id);
    return plainToInstance(OperationResponseDto, operation, classTransformDefaultOptions);
  }

  async create(createOperation: CreateOperationDto): Promise<void> {
    const operation = plainToInstance(Operation, createOperation);
    await this.operationServiceOutPort.save(operation);
  }

  async update(id: number, updateOperation: UpdateOperationDto): Promise<void> {
    await this.operationServiceOutPort.update(id, updateOperation);
  }

  async delete(id: number): Promise<void> {
    await this.operationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
