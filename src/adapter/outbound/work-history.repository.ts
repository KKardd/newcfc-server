import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThanOrEqual, LessThanOrEqual, IsNull } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceOutPort } from '@/port/outbound/work-history-service.out-port';

@Injectable()
export class WorkHistoryRepository implements WorkHistoryServiceOutPort {
  constructor(
    @InjectRepository(WorkHistory)
    private readonly workHistoryRepository: Repository<WorkHistory>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
  ) {}

  async findAll(
    search: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[WorkHistory[], number]> {
    const queryBuilder = this.workHistoryRepository
      .createQueryBuilder('work_history')
      .leftJoinAndMapOne(
        'work_history.chauffeur',
        Chauffeur,
        'chauffeur',
        'chauffeur.id = work_history.chauffeur_id AND chauffeur.status != :chauffeurDeletedStatus',
        { chauffeurDeletedStatus: DataStatus.DELETED },
      )
      .leftJoinAndMapOne(
        'work_history.vehicle',
        Vehicle,
        'vehicle',
        'vehicle.id = work_history.vehicle_id AND vehicle.status != :vehicleDeletedStatus',
        { vehicleDeletedStatus: DataStatus.DELETED },
      );

    // 조건 적용
    if (search.chauffeurId) {
      queryBuilder.andWhere('work_history.chauffeur_id = :chauffeurId', { chauffeurId: search.chauffeurId });
    }

    if (search.vehicleId) {
      queryBuilder.andWhere('work_history.vehicle_id = :vehicleId', { vehicleId: search.vehicleId });
    }

    if (status === DataStatus.DELETED) {
      queryBuilder.andWhere('work_history.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });
    } else if (status) {
      queryBuilder.andWhere('work_history.status = :status', { status });
    }

    if (search.startDate) {
      queryBuilder.andWhere('work_history.start_time >= :startDate', { startDate: search.startDate });
    }

    if (search.endDate) {
      queryBuilder.andWhere('work_history.end_time <= :endDate', { endDate: search.endDate });
    }

    // 정렬 및 페이징 적용
    queryBuilder.orderBy('work_history.start_time', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    const [workHistories, totalCount] = await queryBuilder.getManyAndCount();

    return [workHistories, totalCount];
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
