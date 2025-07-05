import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';

@Injectable()
export class AdminRepository implements AdminServiceOutPort {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>,
  ) {}

  async findAll(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<[AdminResponseDto[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('admin').select('admin.*');

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

    const admins = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const adminsResponse: AdminResponseDto[] = admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      createdAt: admin.created_at,
      updatedAt: admin.updated_at,
    }));

    return [adminsResponse, totalCount];
  }

  async findById(id: number): Promise<Admin> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(admin: Admin): Promise<void> {
    await this.repository.save(admin);
  }

  async update(id: number, admin: Partial<Admin>): Promise<void> {
    await this.repository.update(id, admin);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
