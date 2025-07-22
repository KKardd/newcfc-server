import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchScheduleDto } from '@/adapter/inbound/dto/request/schedule/search-schedule.dto';
import { Schedule } from '@/domain/entity/schedule.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class ScheduleServiceOutPort {
  abstract findAll(
    searchSchedule: SearchScheduleDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[Schedule[], number]>;

  abstract findById(id: number): Promise<Schedule | null>;

  abstract findByOperationId(operationId: number): Promise<Schedule[]>;

  abstract save(schedule: Schedule): Promise<Schedule>;

  abstract update(id: number, schedule: Partial<Schedule>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
