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

    await this.wayPointServiceOutPort.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.wayPointServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async hardDelete(id: number): Promise<void> {
    await this.wayPointServiceOutPort.hardDelete(id);
  }

}
