import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWayPointDto } from '@/adapter/inbound/dto/request/way-point/create-way-point.dto';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { UpdateWayPointDto } from '@/adapter/inbound/dto/request/way-point/update-way-point.dto';
import { WayPointResponseDto } from '@/adapter/inbound/dto/response/way-point/way-point-response.dto';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';
import {} from '@/validate/serialization';

@Injectable()
export class WayPointService implements WayPointServiceInPort {
  constructor(private readonly wayPointServiceOutPort: WayPointServiceOutPort) {}

  async search(
    searchWayPoint: SearchWayPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WayPointResponseDto>> {
    const [wayPoints, total] = await this.wayPointServiceOutPort.findAll(searchWayPoint, paginationQuery, DataStatus.DELETED);

    const pagination = new Pagination({ totalCount: total, paginationQuery });

    const response = plainToInstance(WayPointResponseDto, wayPoints);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<WayPointResponseDto> {
    const wayPoint = await this.wayPointServiceOutPort.findById(id);
    return plainToInstance(WayPointResponseDto, wayPoint);
  }

  async create(createWayPoint: CreateWayPointDto): Promise<void> {
    const { visitTime, scheduledTime, ...restCreateData } = createWayPoint;
    const wayPoint = plainToInstance(WayPoint, restCreateData);

    // visitTime이 있는 경우 Date 타입으로 변환
    if (visitTime) {
      wayPoint.visitTime = new Date(visitTime);
    }

    // scheduledTime 처리
    if (scheduledTime) {
      wayPoint.scheduledTime = new Date(scheduledTime);
    }

    // status 설정
    wayPoint.status = DataStatus.USED;

    // order 재정렬 로직 적용
    if (wayPoint.order && wayPoint.operationId) {
      await this.handleOrderReordering(wayPoint.operationId, wayPoint.order);
    }

    await this.wayPointServiceOutPort.save(wayPoint);
  }

  async update(id: number, updateWayPoint: UpdateWayPointDto): Promise<void> {
    const { visitTime, scheduledTime, ...restUpdateData } = updateWayPoint;
    const updateData: Partial<WayPoint> = { ...restUpdateData };

    // visitTime이 있는 경우 Date 타입으로 변환
    if (visitTime) {
      updateData.visitTime = new Date(visitTime);
    }

    // scheduledTime 처리
    if (scheduledTime) {
      updateData.scheduledTime = new Date(scheduledTime);
    }

    // order 업데이트 시 재정렬 로직 적용
    if (updateData.order) {
      const existingWayPoint = await this.wayPointServiceOutPort.findById(id);
      if (existingWayPoint && existingWayPoint.operationId) {
        // 기존 order와 새로운 order가 다른 경우에만 재정렬 실행
        if (existingWayPoint.order !== updateData.order) {
          await this.handleOrderReordering(existingWayPoint.operationId, updateData.order, id);
        }
      }
    }

    await this.wayPointServiceOutPort.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.wayPointServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  /**
   * WayPoint order 재정렬 처리
   */
  private async handleOrderReordering(operationId: number, targetOrder: number, excludeId?: number): Promise<void> {
    try {
      // 해당 operationId의 모든 wayPoints 조회
      const paginationQuery = new PaginationQuery();
      paginationQuery.page = 1;
      paginationQuery.countPerPage = 100;

      const searchDto = { operationId };
      const [wayPoints] = await this.wayPointServiceOutPort.findAll(searchDto, paginationQuery, DataStatus.DELETED);

      // excludeId가 있는 경우 해당 wayPoint 제외 (update 시 자기 자신 제외)
      const filteredWayPoints = excludeId ? wayPoints.filter((wp) => wp.id !== excludeId) : wayPoints;

      // targetOrder에 기존 wayPoint가 있는지 확인
      const existingWayPoint = filteredWayPoints.find((wp) => wp.order === targetOrder);

      if (existingWayPoint) {
        // targetOrder 이상인 wayPoints를 한 칸씩 뒤로 이동
        await this.shiftWayPointsOrder(operationId, targetOrder, 1, excludeId);
      }
    } catch (error) {
      console.error('WayPoint order 재정렬 중 오류 발생:', error);
      throw new Error('WayPoint order 재정렬에 실패했습니다.');
    }
  }

  /**
   * 특정 order 이상의 wayPoints를 지정된 만큼 뒤로 이동
   */
  private async shiftWayPointsOrder(
    operationId: number,
    fromOrder: number,
    shiftAmount: number,
    excludeId?: number,
  ): Promise<void> {
    const paginationQuery = new PaginationQuery();
    paginationQuery.page = 1;
    paginationQuery.countPerPage = 100;

    const searchDto = { operationId };
    const [wayPoints] = await this.wayPointServiceOutPort.findAll(searchDto, paginationQuery, DataStatus.DELETED);

    // fromOrder 이상인 wayPoints를 order 역순으로 정렬 (충돌 방지)
    // excludeId가 있는 경우 해당 wayPoint 제외
    const wayPointsToShift = wayPoints
      .filter((wp) => wp.order >= fromOrder && (!excludeId || wp.id !== excludeId))
      .sort((a, b) => b.order - a.order);

    for (const wayPoint of wayPointsToShift) {
      await this.wayPointServiceOutPort.update(wayPoint.id, {
        order: wayPoint.order + shiftAmount,
      });
    }
  }
}
