import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateAdminDto } from '@/adapter/inbound/dto/request/admin/create-admin.dto';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { SearchAvailableChauffeursDto } from '@/adapter/inbound/dto/request/admin/search-available-chauffeurs.dto';
import { UpdateAdminDto } from '@/adapter/inbound/dto/request/admin/update-admin.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { AvailableChauffeursResponseDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';

export abstract class AdminServiceInPort {
  abstract search(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<AdminResponseDto>>;

  abstract detail(id: number): Promise<AdminResponseDto>;

  abstract create(createAdmin: CreateAdminDto): Promise<void>;

  abstract update(id: number, updateAdmin: UpdateAdminDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract getAvailableChauffeurs(searchDto: SearchAvailableChauffeursDto): Promise<AvailableChauffeursResponseDto>;
}
