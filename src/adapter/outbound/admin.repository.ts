import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';

@CustomRepository(Admin)
export class AdminRepository extends BaseRepository<Admin> implements AdminServiceOutPort {
  async findAll(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<[Admin[], number]> {
    const queryBuilder = this.createQueryBuilder('admin');

    if (searchAdmin.email) {
      queryBuilder.andWhere('admin.email LIKE :email', {
        email: `%${searchAdmin.email}%`,
      });
    }

    if (searchAdmin.name) {
      queryBuilder.andWhere('admin.name LIKE :name', {
        name: `%${searchAdmin.name}%`,
      });
    }

    if (searchAdmin.phone) {
      queryBuilder.andWhere('admin.phone LIKE :phone', {
        phone: `%${searchAdmin.phone}%`,
      });
    }

    if (searchAdmin.role) {
      queryBuilder.andWhere('admin.role = :role', {
        role: searchAdmin.role,
      });
    }

    if (searchAdmin.approved !== undefined) {
      queryBuilder.andWhere('admin.approved = :approved', {
        approved: searchAdmin.approved,
      });
    }

    if (searchAdmin.status) {
      queryBuilder.andWhere('admin.status = :status', {
        status: searchAdmin.status,
      });
    }

    queryBuilder
      .orderBy('CASE WHEN admin.status = :usedStatus THEN 1 ELSE 0 END', 'DESC')
      .addOrderBy('admin.name', 'ASC')
      .setParameter('usedStatus', DataStatus.USED)
      .offset(paginationQuery.skip)
      .limit(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Admin> {
    return this.findOneOrFail({ where: { id } });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
