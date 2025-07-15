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
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class RealTimeDispatchService implements RealTimeDispatchServiceInPort {
  constructor(
    private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
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

    // 각 실시간 배차지에 대해 쇼퍼 카운트 계산 (삭제된 쇼퍼 제외)
    const responseData = await Promise.all(
      realTimeDispatches.map(async (dispatch) => {
        const dispatchDto = plainToInstance(RealTimeDispatchResponseDto, dispatch, classTransformDefaultOptions);

        // 해당 실시간 배차지에 배정된 쇼퍼 카운트 조회 (삭제되지 않은 쇼퍼만)
        const chauffeurPagination = new PaginationQuery();
        chauffeurPagination.page = 1;
        chauffeurPagination.countPerPage = 1000; // 충분한 수로 설정

        const [chauffeurs] = await this.chauffeurServiceOutPort.findAll(
          { realTimeDispatchId: dispatch.id },
          chauffeurPagination,
          DataStatus.DELETED, // 삭제된 쇼퍼 제외
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
    // 기존 정보와 비교하여 주소 정보가 변경되었는지 확인
    const existingDispatch = await this.realTimeDispatchServiceOutPort.findById(id);
    if (!existingDispatch) throw new Error('실시간 배차지를 찾을 수 없습니다.');

    const isAddressChanged =
      (updateRealTimeDispatch.departureName !== undefined &&
        updateRealTimeDispatch.departureName !== existingDispatch.departureName) ||
      (updateRealTimeDispatch.departureAddress !== undefined &&
        updateRealTimeDispatch.departureAddress !== existingDispatch.departureAddress) ||
      (updateRealTimeDispatch.departureAddressDetail !== undefined &&
        updateRealTimeDispatch.departureAddressDetail !== existingDispatch.departureAddressDetail) ||
      (updateRealTimeDispatch.destinationName !== undefined &&
        updateRealTimeDispatch.destinationName !== existingDispatch.destinationName) ||
      (updateRealTimeDispatch.destinationAddress !== undefined &&
        updateRealTimeDispatch.destinationAddress !== existingDispatch.destinationAddress) ||
      (updateRealTimeDispatch.destinationAddressDetail !== undefined &&
        updateRealTimeDispatch.destinationAddressDetail !== existingDispatch.destinationAddressDetail);

    // 실시간 배차지 정보 업데이트
    await this.realTimeDispatchServiceOutPort.update(id, updateRealTimeDispatch);

    // 주소 정보가 변경된 경우 관련 운행의 waypoint들도 업데이트
    if (isAddressChanged) {
      await this.updateRelatedOperationWayPoints(id, updateRealTimeDispatch);
    }
  }

  /**
   * 실시간 배차지와 관련된 운행의 waypoint들을 업데이트
   */
  private async updateRelatedOperationWayPoints(
    realTimeDispatchId: number,
    updateData: UpdateRealTimeDispatchDto,
  ): Promise<void> {
    try {
      // 해당 실시간 배차지와 연결된 운행들 조회
      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 1000;

      const [operations] = await this.operationServiceOutPort.findAll(
        { realTimeDispatchId },
        operationPagination,
        DataStatus.DELETED,
      );

      // 각 운행의 waypoint들을 업데이트
      for (const operation of operations) {
        const wayPointPagination = new PaginationQuery();
        wayPointPagination.page = 1;
        wayPointPagination.countPerPage = 100;

        const wayPoints = await this.wayPointServiceInPort.search({ operationId: operation.id }, wayPointPagination);

        const sortedWayPoints = wayPoints.data.sort((a, b) => a.order - b.order);

        for (const wayPoint of sortedWayPoints) {
          let updateWayPointData: any = {};

          // 출발지 waypoint 업데이트 (order = 1)
          if (wayPoint.order === 1) {
            if (updateData.departureName !== undefined) {
              updateWayPointData.name = updateData.departureName;
            }
            if (updateData.departureAddress !== undefined) {
              updateWayPointData.address = updateData.departureAddress;
            }
            if (updateData.departureAddressDetail !== undefined) {
              updateWayPointData.addressDetail = updateData.departureAddressDetail;
            }
          }
          // 도착지 waypoint 업데이트 (order = 2 또는 마지막)
          else if (wayPoint.order === 2 || wayPoint.order === sortedWayPoints.length) {
            if (updateData.destinationName !== undefined) {
              updateWayPointData.name = updateData.destinationName;
            }
            if (updateData.destinationAddress !== undefined) {
              updateWayPointData.address = updateData.destinationAddress;
            }
            if (updateData.destinationAddressDetail !== undefined) {
              updateWayPointData.addressDetail = updateData.destinationAddressDetail;
            }
          }

          // waypoint 정보가 있으면 업데이트
          if (Object.keys(updateWayPointData).length > 0) {
            await this.wayPointServiceInPort.update(wayPoint.id, updateWayPointData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update related operation waypoints:', error);
      // 에러가 발생해도 전체 업데이트 플로우는 계속 진행
    }
  }

  async delete(id: number): Promise<void> {
    // 먼저 해당 실시간 배차지에 할당된 쇼퍼가 있는지 확인
    const chauffeurPagination = new PaginationQuery();
    chauffeurPagination.page = 1;
    chauffeurPagination.countPerPage = 1000;

    const [assignedChauffeurs] = await this.chauffeurServiceOutPort.findAll(
      { realTimeDispatchId: id },
      chauffeurPagination,
      DataStatus.DELETED,
    );

    // 할당된 쇼퍼가 있는 경우 삭제 불가
    if (assignedChauffeurs.length > 0) {
      const error = new Error('할당된 쇼퍼가 있는 실시간 배차지는 삭제할 수 없습니다.');
      (error as any).statusCode = 400;
      throw error;
    }

    // 실시간 배차지 삭제
    await this.realTimeDispatchServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
