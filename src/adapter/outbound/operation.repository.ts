import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Operation)
export class OperationRepository extends BaseRepository<Operation> implements OperationServiceOutPort {
  async findAll(search: SearchOperationDto, paginationQuery: PaginationQuery): Promise<[Operation[], number]> {
    const queryBuilder = this.createQueryBuilder('operation')
      .leftJoinAndSelect('operation.chauffeur', 'chauffeur')
      .leftJoinAndSelect('operation.vehicle', 'vehicle')
      .leftJoinAndSelect('operation.realTimeDispatch', 'realTimeDispatch')
      .leftJoinAndSelect('realTimeDispatch.wayPoints', 'wayPoints');

    if (search.type) {
      queryBuilder.andWhere('operation.type = :type', {
        type: search.type,
      });
    }

    if (search.isRepeated !== undefined) {
      queryBuilder.andWhere('operation.is_repeated = :isRepeated', {
        isRepeated: search.isRepeated,
      });
    }

    if (search.startTime) {
      queryBuilder.andWhere('operation.start_time >= :startTime', {
        startTime: search.startTime,
      });
    }

    if (search.endTime) {
      queryBuilder.andWhere('operation.end_time <= :endTime', {
        endTime: search.endTime,
      });
    }

    if (search.chauffeurId) {
      queryBuilder.andWhere('operation.chauffeur_id = :chauffeurId', {
        chauffeurId: search.chauffeurId,
      });
    }

    if (search.vehicleId) {
      queryBuilder.andWhere('operation.vehicle_id = :vehicleId', {
        vehicleId: search.vehicleId,
      });
    }

    if (search.realTimeDispatchId) {
      queryBuilder.andWhere('operation.real_time_dispatch_id = :realTimeDispatchId', {
        realTimeDispatchId: search.realTimeDispatchId,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('operation.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('operation.startTime', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Operation> {
    return this.findOneOrFail({ where: { id } });
  }

  async findByIdWithDetails(id: number): Promise<Operation> {
    return this.createQueryBuilder('operation')
      .leftJoinAndSelect('operation.chauffeur', 'chauffeur')
      .leftJoinAndSelect('operation.vehicle', 'vehicle')
      .leftJoinAndSelect('operation.realTimeDispatch', 'realTimeDispatch')
      .leftJoinAndSelect('realTimeDispatch.wayPoints', 'wayPoints')
      .where('operation.id = :id', { id })
      .getOneOrFail();
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
