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
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class WayPointService implements WayPointServiceInPort {
  constructor(private readonly wayPointServiceOutPort: WayPointServiceOutPort) {}

  async search(
    searchWayPoint: SearchWayPointDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WayPointResponseDto>> {
    const [wayPoints, total] = await this.wayPointServiceOutPort.findAll(searchWayPoint, paginationQuery);

    const pagination = new Pagination({ totalCount: total, paginationQuery });

    const response = plainToInstance(WayPointResponseDto, wayPoints, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<WayPointResponseDto> {
    const wayPoint = await this.wayPointServiceOutPort.findById(id);
    return plainToInstance(WayPointResponseDto, wayPoint, classTransformDefaultOptions);
  }

  async create(createWayPoint: CreateWayPointDto): Promise<void> {
    const wayPoint = new WayPoint();
    wayPoint.reservationId = createWayPoint.reservationId;
    wayPoint.address = createWayPoint.address;
    wayPoint.order = createWayPoint.order;
    wayPoint.status = DataStatus.USED;

    await this.wayPointServiceOutPort.save(wayPoint);
  }

  async update(id: number, updateWayPoint: UpdateWayPointDto): Promise<void> {
    await this.wayPointServiceOutPort.update(id, updateWayPoint);
  }

  async delete(id: number): Promise<void> {
    await this.wayPointServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
