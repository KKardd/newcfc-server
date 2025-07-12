import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceOutPort } from '@/port/outbound/work-history-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(WorkHistory)
export class WorkHistoryRepository extends BaseRepository<WorkHistory> implements WorkHistoryServiceOutPort {
  async findAll(search: SearchWorkHistoryDto, paginationQuery: PaginationQuery): Promise<[WorkHistory[], number]> {
    const queryBuilder = this.createQueryBuilder('work_history')
      .leftJoinAndSelect('work_history.chauffeur', 'chauffeur')
      .leftJoinAndSelect('work_history.vehicle', 'vehicle');

    if (search.chauffeurId) {
      queryBuilder.andWhere('work_history.chauffeurId = :chauffeurId', {
        chauffeurId: search.chauffeurId,
      });
    }

    if (search.vehicleId) {
      queryBuilder.andWhere('work_history.vehicleId = :vehicleId', {
        vehicleId: search.vehicleId,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('work_history.status = :status', {
        status: search.status,
      });
    }

    if (search.startDate) {
      queryBuilder.andWhere('work_history.startTime >= :startDate', {
        startDate: search.startDate,
      });
    }

    if (search.endDate) {
      queryBuilder.andWhere('work_history.endTime <= :endDate', {
        endDate: search.endDate,
      });
    }

    queryBuilder.orderBy('work_history.startTime', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<WorkHistory> {
    return this.findOneOrFail({ where: { id } });
  }

  async findActiveByChauffeurId(chauffeurId: number): Promise<WorkHistory | null> {
    return this.findOne({
      where: {
        chauffeurId,
        status: DataStatus.USED,
      },
    });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
