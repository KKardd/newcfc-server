import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWayPointDto } from '@/adapter/inbound/dto/request/way-point/search-way-point.dto';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(WayPoint)
export class WayPointRepository extends BaseRepository<WayPoint> implements WayPointServiceOutPort {
  async findAll(search: SearchWayPointDto, paginationQuery: PaginationQuery): Promise<[WayPoint[], number]> {
    const queryBuilder = this.createQueryBuilder('way_point');

    if (search.operationId) {
      queryBuilder.andWhere('way_point.operationId = :operationId', {
        operationId: search.operationId,
      });
    }

    if (search.address) {
      queryBuilder.andWhere('way_point.address LIKE :address', {
        address: `%${search.address}%`,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('way_point.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('way_point.order', 'ASC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<WayPoint> {
    return this.findOneOrFail({ where: { id } });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
