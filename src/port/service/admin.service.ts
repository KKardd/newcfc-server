import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateAdminDto } from '@/adapter/inbound/dto/request/admin/create-admin.dto';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { SearchAvailableChauffeursDto } from '@/adapter/inbound/dto/request/admin/search-available-chauffeurs.dto';
import { UpdateAdminDto } from '@/adapter/inbound/dto/request/admin/update-admin.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { AvailableChauffeursResponseDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceInPort } from '@/port/inbound/admin-service.in-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class AdminService implements AdminServiceInPort {
  constructor(
    private readonly adminServiceOutPort: AdminServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
  ) {}

  async search(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<AdminResponseDto>> {
    const [admins, totalCount] = await this.adminServiceOutPort.findAll(searchAdmin, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(AdminResponseDto, admins, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminServiceOutPort.findById(id);
    return plainToInstance(AdminResponseDto, admin, classTransformDefaultOptions);
  }

  async create(createAdmin: CreateAdminDto): Promise<void> {
    const admin = plainToInstance(Admin, createAdmin);
    admin.password = await bcrypt.hash(admin.password, 10);
    await this.adminServiceOutPort.save(admin);
  }

  async update(id: number, updateAdmin: UpdateAdminDto): Promise<void> {
    await this.adminServiceOutPort.update(id, updateAdmin);
  }

  async delete(id: number): Promise<void> {
    await this.adminServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async getAvailableChauffeurs(searchDto: SearchAvailableChauffeursDto): Promise<AvailableChauffeursResponseDto> {
    const [availableChauffeurs, unassignedVehicles] = await Promise.all([
      this.chauffeurServiceOutPort.findAvailableChauffeurs(searchDto.startTime, searchDto.endTime),
      this.vehicleServiceOutPort.findUnassignedVehicles(),
    ]);

    return plainToInstance(
      AvailableChauffeursResponseDto,
      {
        availableChauffeurs,
        unassignedVehicles,
      },
      classTransformDefaultOptions,
    );
  }
}
