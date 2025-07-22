import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateScheduleDto } from '@/adapter/inbound/dto/request/schedule/create-schedule.dto';
import { SearchScheduleDto } from '@/adapter/inbound/dto/request/schedule/search-schedule.dto';
import { ScheduleResponseDto } from '@/adapter/inbound/dto/response/schedule/schedule-response.dto';

export abstract class ScheduleServiceInPort {
  abstract search(
    searchSchedule: SearchScheduleDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ScheduleResponseDto>>;

  abstract detail(id: number): Promise<ScheduleResponseDto>;

  abstract create(createSchedule: CreateScheduleDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract findByOperationId(operationId: number): Promise<ScheduleResponseDto[]>;
}
