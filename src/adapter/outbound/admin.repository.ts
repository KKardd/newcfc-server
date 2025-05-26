import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';

@Injectable()
export class AdminRepository implements AdminServiceOutPort {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>,
  ) {}

  async findAll(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<[Admin[], number]> {
    const query = this.repository.createQueryBuilder('admin');

    if (searchAdmin.email) {
      query.andWhere('admin.email LIKE :email', {
        email: `%${searchAdmin.email}%`,
      });
    }

    if (searchAdmin.name) {
      query.andWhere('admin.name LIKE :name', {
        name: `%${searchAdmin.name}%`,
      });
    }

    if (searchAdmin.phone) {
      query.andWhere('admin.phone LIKE :phone', {
        phone: `%${searchAdmin.phone}%`,
      });
    }

    if (searchAdmin.role) {
      query.andWhere('admin.role = :role', {
        role: searchAdmin.role,
      });
    }

    if (searchAdmin.status) {
      query.andWhere('admin.status = :status', {
        status: searchAdmin.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
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
