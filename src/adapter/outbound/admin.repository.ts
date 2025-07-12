import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';

@Injectable()
export class AdminRepository implements AdminServiceOutPort {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAll(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery, status?: string): Promise<[Admin[], number]> {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

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

    // status 파라미터 처리
    if (status === 'delete') {
      queryBuilder.andWhere('admin.status != :deleteStatus', { deleteStatus: 'delete' });
    } else if (status) {
      queryBuilder.andWhere('admin.status = :statusParam', { statusParam: status });
    }

    queryBuilder
      .orderBy('CASE WHEN admin.status = :usedStatus THEN 1 ELSE 0 END', 'DESC')
      .addOrderBy('admin.name', 'ASC')
      .setParameter('usedStatus', DataStatus.USED)
      .offset(paginationQuery.skip)
      .limit(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async save(admin: Admin): Promise<Admin> {
    return this.adminRepository.save(admin);
  }

  async update(id: number, admin: Partial<Admin>) {
    return this.adminRepository.update(id, admin);
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.adminRepository.update(id, { status });
  }
}
