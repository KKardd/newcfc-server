import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Not, MoreThanOrEqual, LessThanOrEqual, IsNull, Between, FindOptionsWhere } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceOutPort } from '@/port/outbound/work-history-service.out-port';

@Injectable()
export class WorkHistoryRepository implements WorkHistoryServiceOutPort {
  constructor(
    @InjectRepository(WorkHistory)
    private readonly workHistoryRepository: Repository<WorkHistory>,
  ) {}

  async findAll(
    search: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[WorkHistory[], number]> {
    const where: FindOptionsWhere<WorkHistory> = {};
    if (search.chauffeurId) where.chauffeurId = search.chauffeurId;
    if (search.vehicleId) where.vehicleId = search.vehicleId;

    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status as DataStatus;
    }

    // KST 기준으로 날짜 범위 처리하는 유틸
    const toUtcFromKst = (kstDate: Date) => new Date(kstDate.getTime() - 9 * 60 * 60 * 1000);

    if (search.year && search.month) {
      const startOfMonthKST = new Date(search.year, search.month - 1, 1, 0, 0, 0, 0);
      const endOfMonthKST = new Date(search.year, search.month, 0, 23, 59, 59, 999);

      const startOfMonthUTC = toUtcFromKst(startOfMonthKST);
      const endOfMonthUTC = toUtcFromKst(endOfMonthKST);

      where.startTime = Between(startOfMonthUTC, endOfMonthUTC);
    } else {
      if (search.startDate) {
        const startDate = new Date(`${search.startDate}T00:00:00+09:00`);
        where.startTime = MoreThanOrEqual(new Date(startDate.toISOString()));
      }

      if (search.endDate) {
        const endDate = new Date(`${search.endDate}T23:59:59.999+09:00`);
        where.endTime = LessThanOrEqual(new Date(endDate.toISOString()));
      }
    }

    return this.workHistoryRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { startTime: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<WorkHistory | null> {
    return this.workHistoryRepository.findOne({ where: { id } });
  }

  async findActiveByChauffeurId(chauffeurId: number): Promise<WorkHistory | null> {
    return this.workHistoryRepository.findOne({
      where: {
        chauffeurId,
        endTime: IsNull(),
        status: Not(DataStatus.DELETED),
      },
    });
  }

  async save(workHistory: WorkHistory): Promise<WorkHistory> {
    return this.workHistoryRepository.save(workHistory);
  }

  async update(id: number, workHistory: Partial<WorkHistory>) {
    return this.workHistoryRepository.update(id, workHistory);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.workHistoryRepository.update(id, { status });
  }
}
