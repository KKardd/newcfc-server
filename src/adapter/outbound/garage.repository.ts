import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchGarageDto } from '@/adapter/inbound/dto/request/garage/search-garage.dto';
import { Garage } from '@/domain/entity/garage.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Garage)
export class GarageRepository extends BaseRepository<Garage> implements GarageServiceOutPort {
  async findAll(search: SearchGarageDto, paginationQuery: PaginationQuery): Promise<[Garage[], number]> {
    const queryBuilder = this.createQueryBuilder('garage').leftJoinAndSelect('garage.vehicles', 'vehicle');

    if (search.name) {
      queryBuilder.andWhere('garage.name LIKE :name', {
        name: `%${search.name}%`,
      });
    }

    if (search.address) {
      queryBuilder.andWhere('garage.address LIKE :address', {
        address: `%${search.address}%`,
      });
    }

    if (search.status) {
      queryBuilder.andWhere('garage.status = :status', {
        status: search.status,
      });
    }

    queryBuilder.orderBy('garage.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Garage> {
    return this.findOneOrFail({ where: { id } });
  }

  async findByIdWithVehicleCount(id: number): Promise<Garage> {
    return this.createQueryBuilder('garage')
      .leftJoinAndSelect('garage.vehicles', 'vehicle')
      .where('garage.id = :id', { id })
      .getOneOrFail();
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
