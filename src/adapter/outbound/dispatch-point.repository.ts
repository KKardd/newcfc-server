import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchDispatchPointDto } from '@/adapter/inbound/dto/request/dispatch-point/search-dispatch-point.dto';
import { DispatchPoint } from '@/domain/entity/dispatch-point.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { DispatchPointServiceOutPort } from '@/port/outbound/dispatch-point-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(DispatchPoint)
export class DispatchPointRepository extends BaseRepository<DispatchPoint> implements DispatchPointServiceOutPort {
  async findAll(search: SearchDispatchPointDto, paginationQuery: PaginationQuery): Promise<[DispatchPoint[], number]> {
    const queryBuilder = this.createQueryBuilder('dispatch_point');

    if (search.name) {
      queryBuilder.andWhere('dispatch_point.name LIKE :name', {
        name: `%${search.name}%`,
      });
    }

    if (search.address) {
      queryBuilder.andWhere('dispatch_point.address LIKE :address', {
        address: `%${search.address}%`,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('dispatch_point.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('dispatch_point.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<DispatchPoint> {
    return this.findOneOrFail({ where: { id } });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
