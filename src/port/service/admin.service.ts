import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateAdminDto } from '@/adapter/inbound/dto/request/admin/create-admin.dto';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { SearchAvailableChauffeursDto } from '@/adapter/inbound/dto/request/admin/search-available-chauffeurs.dto';
import { UpdateAdminDto } from '@/adapter/inbound/dto/request/admin/update-admin.dto';
import { AdminProfileResponseDto } from '@/adapter/inbound/dto/response/admin/admin-profile-response.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { AvailableChauffeursResponseDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { AdminServiceInPort } from '@/port/inbound/admin-service.in-port';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { AdminServiceOutPort } from '@/port/outbound/admin-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class AdminService implements AdminServiceInPort {
  constructor(
    private readonly adminServiceOutPort: AdminServiceOutPort,
    private readonly chauffeurServiceInPort: ChauffeurServiceInPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly garageServiceOutPort: GarageServiceOutPort,
  ) {}

  async search(searchAdmin: SearchAdminDto, paginationQuery: PaginationQuery): Promise<PaginationResponse<AdminResponseDto>> {
    const [admins, totalCount] = await this.adminServiceOutPort.findAll(searchAdmin, paginationQuery, DataStatus.DELETED);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(AdminResponseDto, admins).map((admin) => {
      admin.adminName = admin.name;
      return admin;
    });

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminServiceOutPort.findById(id);
    const response = plainToInstance(AdminResponseDto, admin);
    response.adminName = response.name;
    return response;
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
    // 예약 배차용: 시간대별 사용 가능한 모든 기사와 차량 조회 (상태/타입 제한 없음)
    const [availableChauffeurs, availableVehicles] = await Promise.all([
      this.chauffeurServiceOutPort.findAvailableChauffeursForReservation(searchDto.startTime, searchDto.endTime),
      this.vehicleServiceOutPort.findAvailableVehiclesForReservation(searchDto.startTime, searchDto.endTime),
    ]);

    // 기사들의 vehicle, garage 정보를 별도로 조회해서 매핑
    const enrichedChauffeurs = await this.enrichChauffeursWithVehicleAndGarage(availableChauffeurs);

    return plainToInstance(AvailableChauffeursResponseDto, {
      availableChauffeurs: enrichedChauffeurs,
      unassignedVehicles: availableVehicles,
    });
  }


  /**
   * 기사들의 vehicle, garage 정보를 조회해서 매핑
   */
  private async enrichChauffeursWithVehicleAndGarage(chauffeurs: any[]): Promise<any[]> {
    const enrichedChauffeurs = [];

    for (const chauffeur of chauffeurs) {
      const enrichedChauffeur = { ...chauffeur };

      // vehicleId가 있으면 vehicle 정보 조회
      if (chauffeur.vehicleId) {
        try {
          const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
          enrichedChauffeur.vehicle = vehicle;

          // vehicle에 garageId가 있으면 garage 정보도 조회
          if (vehicle?.garageId) {
            try {
              const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
              enrichedChauffeur.garage = garage;
            } catch (error) {
              console.log(`Failed to find garage ${vehicle.garageId}:`, error);
              enrichedChauffeur.garage = null;
            }
          } else {
            enrichedChauffeur.garage = null;
          }
        } catch (error) {
          console.log(`Failed to find vehicle ${chauffeur.vehicleId}:`, error);
          enrichedChauffeur.vehicle = null;
          enrichedChauffeur.garage = null;
        }
      } else {
        enrichedChauffeur.vehicle = null;
        enrichedChauffeur.garage = null;
      }

      enrichedChauffeurs.push(enrichedChauffeur);
    }

    return enrichedChauffeurs;
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
    return plainToInstance(AdminProfileResponseDto, admin);
  }
}
