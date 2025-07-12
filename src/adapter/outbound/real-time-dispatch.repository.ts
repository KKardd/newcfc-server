import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchRealTimeDispatchDto } from '@/adapter/inbound/dto/request/real-time-dispatch/search-real-time-dispatch.dto';
import { RealTimeDispatch } from '@/domain/entity/real-time-dispatch.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(RealTimeDispatch)
export class RealTimeDispatchRepository extends BaseRepository<RealTimeDispatch> implements RealTimeDispatchServiceOutPort {
  async findAll(search: SearchRealTimeDispatchDto, paginationQuery: PaginationQuery): Promise<[RealTimeDispatch[], number]> {
    const queryBuilder = this.createQueryBuilder('real_time_dispatch');

    if (search.departureName) {
      queryBuilder.andWhere('real_time_dispatch.departureName LIKE :departureName', {
        departureName: `%${search.departureName}%`,
      });
    }

    if (search.departureAddress) {
      queryBuilder.andWhere('real_time_dispatch.departure_address LIKE :departureAddress', {
        departureAddress: `%${search.departureAddress}%`,
      });
    }

    if (search.destinationName) {
      queryBuilder.andWhere('real_time_dispatch.destination_name LIKE :destinationName', {
        destinationName: `%${search.destinationName}%`,
      });
    }

    if (search.destinationAddress) {
      queryBuilder.andWhere('real_time_dispatch.destination_address LIKE :destinationAddress', {
        destinationAddress: `%${search.destinationAddress}%`,
      });
    }

    if (search.departureAddressDetail) {
      queryBuilder.andWhere('real_time_dispatch.departure_address_detail LIKE :departureAddressDetail', {
        departureAddressDetail: `%${search.departureAddressDetail}%`,
      });
    }

    if (search.destinationAddressDetail) {
      queryBuilder.andWhere('real_time_dispatch.destination_address_detail LIKE :destinationAddressDetail', {
        destinationAddressDetail: `%${search.destinationAddressDetail}%`,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('real_time_dispatch.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('real_time_dispatch.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<RealTimeDispatch> {
    return this.findOneOrFail({ where: { id } });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
