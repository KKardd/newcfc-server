import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateScheduleDto } from '@/adapter/inbound/dto/request/schedule/create-schedule.dto';
import { SearchScheduleDto } from '@/adapter/inbound/dto/request/schedule/search-schedule.dto';
import { ScheduleResponseDto } from '@/adapter/inbound/dto/response/schedule/schedule-response.dto';
import { Schedule } from '@/domain/entity/schedule.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ScheduleServiceInPort } from '@/port/inbound/schedule-service.in-port';
import { ScheduleServiceOutPort } from '@/port/outbound/schedule-service.out-port';

@Injectable()
export class ScheduleService implements ScheduleServiceInPort {
  constructor(private readonly scheduleServiceOutPort: ScheduleServiceOutPort) {}

  async search(
    searchSchedule: SearchScheduleDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ScheduleResponseDto>> {
    const [schedules, totalCount] = await this.scheduleServiceOutPort.findAll(
      searchSchedule,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(ScheduleResponseDto, schedules);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleServiceOutPort.findById(id);
    return plainToInstance(ScheduleResponseDto, schedule);
  }

  async create(createSchedule: CreateScheduleDto): Promise<void> {
    const schedule = plainToInstance(Schedule, createSchedule);
    await this.scheduleServiceOutPort.save(schedule);
  }

  async delete(id: number): Promise<void> {
    await this.scheduleServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async findByOperationId(operationId: number): Promise<ScheduleResponseDto[]> {
    const schedules = await this.scheduleServiceOutPort.findByOperationId(operationId);
    return plainToInstance(ScheduleResponseDto, schedules);
  }
}
