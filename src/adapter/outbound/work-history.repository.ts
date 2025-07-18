import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThanOrEqual, LessThanOrEqual, IsNull } from 'typeorm';
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
    const where: any = {};
    if (search.chauffeurId) where.chauffeurId = search.chauffeurId;
    if (search.vehicleId) where.vehicleId = search.vehicleId;
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }
    if (search.startDate) where.startTime = MoreThanOrEqual(search.startDate);
    if (search.endDate) where.endTime = LessThanOrEqual(search.endDate);
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
