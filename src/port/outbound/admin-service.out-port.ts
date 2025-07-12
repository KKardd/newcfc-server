import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class AdminServiceOutPort {
  abstract findAll(
    searchAdmin: SearchAdminDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[AdminResponseDto[], number]>;

  abstract findById(id: number): Promise<Admin | null>;

  abstract save(admin: Admin): Promise<Admin>;

  abstract update(id: number, admin: Partial<Admin>): Promise<UpdateResult>;

  abstract updateStatus(id: number, status: DataStatus): Promise<UpdateResult>;
}
