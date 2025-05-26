import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class AdminServiceOutPort {
  abstract findAll(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<[Admin[], number]>;

  abstract findById(id: number): Promise<Admin>;

  abstract save(admin: Admin): Promise<void>;

  abstract update(id: number, admin: Partial<Admin>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
