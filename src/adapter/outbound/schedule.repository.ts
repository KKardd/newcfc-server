import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchScheduleDto } from '@/adapter/inbound/dto/request/schedule/search-schedule.dto';
import { Schedule } from '@/domain/entity/schedule.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ScheduleServiceOutPort } from '@/port/outbound/schedule-service.out-port';

@Injectable()
export class ScheduleRepository implements ScheduleServiceOutPort {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(search: SearchScheduleDto, paginationQuery: PaginationQuery, status?: string): Promise<[Schedule[], number]> {
    const where: any = {};

    if (search.operationId) where.operationId = search.operationId;
    if (search.wayPointId) where.wayPointId = search.wayPointId;
    if (search.chauffeurStatus) where.chauffeurStatus = search.chauffeurStatus;

    // 날짜 범위 검색
    if (search.startDate && search.endDate) {
      where.visitTime = Between(search.startDate, search.endDate);
    } else if (search.startDate) {
      where.visitTime = Between(search.startDate, new Date());
    } else if (search.endDate) {
      where.visitTime = Between(new Date('1970-01-01'), search.endDate);
    }

    // 상태 필터링
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }

    return this.scheduleRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { visitTime: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({ where: { id } });
  }

  async findByOperationId(operationId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: {
        operationId,
        status: Not(DataStatus.DELETED),
      },
      order: { visitTime: 'ASC' },
    });
  }

  async save(schedule: Schedule): Promise<Schedule> {
    return this.scheduleRepository.save(schedule);
  }

  async update(id: number, schedule: Partial<Schedule>) {
    return this.scheduleRepository.update(id, schedule);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.scheduleRepository.update(id, { status });
  }
}
