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
import { AdminProfileResponseDto } from '@/adapter/inbound/dto/response/admin/admin-profile-response.dto';
import { AvailableChauffeursResponseDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { AdminServiceInPort } from '@/port/inbound/admin-service.in-port';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class AdminService implements AdminServiceInPort {
  constructor(
    private readonly adminServiceOutPort: AdminServiceOutPort,
    private readonly chauffeurServiceInPort: ChauffeurServiceInPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
  ) {}

  async search(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<AdminResponseDto>> {
    const [admins, totalCount] = await this.adminServiceOutPort.findAll(searchAdmin, paginationQuery, DataStatus.DELETED);
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
    admin.approved = false;
    await this.adminServiceOutPort.save(admin);
  }

  async update(id: number, updateAdmin: UpdateAdminDto): Promise<void> {
    if (updateAdmin.password) {
      updateAdmin.password = await bcrypt.hash(updateAdmin.password, 10);
    }
    await this.adminServiceOutPort.update(id, updateAdmin);
  }

  async delete(id: number): Promise<void> {
    await this.adminServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async getAvailableChauffeurs(searchDto: SearchAvailableChauffeursDto): Promise<AvailableChauffeursResponseDto> {
    // 1. 모든 행사 쇼퍼들의 오늘 배차 상태를 먼저 체크하고 업데이트
    await this.checkAllEventChauffeursStatus();

    // 2. 사용 가능한 기사와 미배정 차량 조회
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

  /**
   * 모든 행사 쇼퍼들의 오늘 배차 상태를 체크하고 업데이트
   */
  private async checkAllEventChauffeursStatus(): Promise<void> {
    try {
      // EVENT 타입의 모든 쇼퍼 조회
      const paginationQuery = new PaginationQuery();
      paginationQuery.page = 1;
      paginationQuery.countPerPage = 1000; // 충분한 수로 설정

      const searchDto = {
        type: ChauffeurType.EVENT,
      };

      const eventChauffeurs = await this.chauffeurServiceInPort.search(searchDto, paginationQuery);

      // 각 행사 쇼퍼에 대해 상태 체크
      const statusCheckPromises = eventChauffeurs.data.map((chauffeur) =>
        this.chauffeurServiceInPort.checkAndUpdateEventChauffeurStatus(chauffeur.id),
      );

      await Promise.all(statusCheckPromises);
    } catch (error) {
      console.error('Failed to check event chauffeurs status:', error);
      // 에러가 발생해도 배차 조회는 계속 진행
    }
  }

  async getMyProfile(adminId: number): Promise<AdminProfileResponseDto> {
    const admin = await this.adminServiceOutPort.findById(adminId);
    return plainToInstance(AdminProfileResponseDto, admin, classTransformDefaultOptions);
  }
}
