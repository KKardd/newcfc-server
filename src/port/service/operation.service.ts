import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { AssignChauffeurDto } from '@/adapter/inbound/dto/request/admin/assign-chauffeur.dto';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { AssignChauffeurResponseDto } from '@/adapter/inbound/dto/response/admin/assign-chauffeur-response.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class OperationService implements OperationServiceInPort {
  constructor(
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
  ) {}

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

  async assignChauffeur(assignDto: AssignChauffeurDto): Promise<AssignChauffeurResponseDto> {
    // 1. 운행 정보 조회
    const operation = await this.operationServiceOutPort.findById(assignDto.operationId);

    // 2. 새로 배정할 기사 정보 조회
    const newChauffeur = await this.chauffeurServiceOutPort.findById(assignDto.chauffeurId);

    // 3. 이전 기사 정보 저장 (있다면)
    let previousChauffeur = null;
    if (operation.chauffeurId) {
      previousChauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
    }

    // 4. 운행에 새로운 기사 배정
    await this.operationServiceOutPort.update(assignDto.operationId, {
      chauffeurId: assignDto.chauffeurId,
    });

    // 5. 응답 생성
    return plainToInstance(
      AssignChauffeurResponseDto,
      {
        operationId: assignDto.operationId,
        newChauffeurId: newChauffeur.id,
        newChauffeurName: newChauffeur.name,
        previousChauffeurId: previousChauffeur?.id || null,
        previousChauffeurName: previousChauffeur?.name || null,
        message: previousChauffeur
          ? `기사가 변경되었습니다. ${previousChauffeur.name} → ${newChauffeur.name}`
          : `기사가 배정되었습니다. ${newChauffeur.name}`,
      },
      classTransformDefaultOptions,
    );
  }
}
