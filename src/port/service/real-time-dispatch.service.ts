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
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class RealTimeDispatchService implements RealTimeDispatchServiceInPort {
  constructor(
    private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
  ) {}

  async search(
    searchRealTimeDispatch: SearchRealTimeDispatchDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<RealTimeDispatchResponseDto>> {
    const [realTimeDispatches, totalCount] = await this.realTimeDispatchServiceOutPort.findAll(
      searchRealTimeDispatch,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 실시간 배차지에 대해 쇼퍼 카운트 계산
    const responseData = await Promise.all(
      realTimeDispatches.map(async (dispatch) => {
        const dispatchDto = plainToInstance(RealTimeDispatchResponseDto, dispatch, classTransformDefaultOptions);

        // 해당 실시간 배차지에 배정된 쇼퍼 카운트 조회
        const chauffeurPagination = new PaginationQuery();
        chauffeurPagination.page = 1;
        chauffeurPagination.countPerPage = 1000; // 충분한 수로 설정

        const [chauffeurs] = await this.chauffeurServiceOutPort.findAll(
          { realTimeDispatchId: dispatch.id },
          chauffeurPagination,
          DataStatus.DELETED,
        );

        dispatchDto.chauffeurCount = chauffeurs.length;
        return dispatchDto;
      }),
    );

    return new PaginationResponse(responseData, pagination);
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
