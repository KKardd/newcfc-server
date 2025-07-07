import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { AvailableChauffeurDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { Vehicle } from '@/domain/entity/vehicle.entity';
import { Garage } from '@/domain/entity/garage.entity';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';

@Injectable()
export class ChauffeurRepository implements ChauffeurServiceOutPort {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly repository: Repository<Chauffeur>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Garage)
    private readonly garageRepository: Repository<Garage>,
  ) {}

  async findAll(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<[ChauffeurResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('chauffeur')
      .leftJoin(Vehicle, 'vehicle', 'chauffeur.vehicle_id = vehicle.id')
      .leftJoin(Garage, 'garage', 'vehicle.garage_id = garage.id')
      .select('chauffeur.*')
      .addSelect('vehicle.id', 'vehicle_id')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('vehicle.garage_id', 'vehicle_garage_id')
      .addSelect('vehicle.vehicle_status', 'vehicle_status')
      .addSelect('vehicle.status', 'vehicle_data_status')
      .addSelect('vehicle.created_by', 'vehicle_created_by')
      .addSelect('vehicle.created_at', 'vehicle_created_at')
      .addSelect('vehicle.updated_by', 'vehicle_updated_by')
      .addSelect('vehicle.updated_at', 'vehicle_updated_at')
      .addSelect('garage.id', 'garage_id')
      .addSelect('garage.name', 'garage_name')
      .addSelect('garage.address', 'garage_address')
      .addSelect('garage.status', 'garage_status')
      .addSelect('garage.created_by', 'garage_created_by')
      .addSelect('garage.created_at', 'garage_created_at')
      .addSelect('garage.updated_by', 'garage_updated_by')
      .addSelect('garage.updated_at', 'garage_updated_at')
      .where('chauffeur.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });

    if (searchChauffeur.name) {
      queryBuilder.andWhere('chauffeur.name LIKE :name', {
        name: `%${searchChauffeur.name}%`,
      });
    }

    if (searchChauffeur.phone) {
      queryBuilder.andWhere('chauffeur.phone LIKE :phone', {
        phone: `%${searchChauffeur.phone}%`,
      });
    }

    if (searchChauffeur.birthDate) {
      queryBuilder.andWhere('chauffeur.birth_date = :birthDate', {
        birthDate: searchChauffeur.birthDate,
      });
    }

    if (searchChauffeur.type) {
      queryBuilder.andWhere('chauffeur.type = :type', {
        type: searchChauffeur.type,
      });
    }

    if (searchChauffeur.chauffeurStatus) {
      queryBuilder.andWhere('chauffeur.chauffeur_status = :chauffeurStatus', {
        chauffeurStatus: searchChauffeur.chauffeurStatus,
      });
    }

    if (searchChauffeur.status) {
      queryBuilder.andWhere('chauffeur.status = :status', {
        status: searchChauffeur.status,
      });
    }

    // 실시간 배차지 필터링 (chauffeur 테이블의 realTimeDispatchId 필드 직접 검색)
    if (searchChauffeur.realTimeDispatchId) {
      queryBuilder.andWhere('chauffeur.real_time_dispatch_id = :realTimeDispatchId', {
        realTimeDispatchId: searchChauffeur.realTimeDispatchId,
      });
    }

    // 실시간 배차지가 null인 기사 검색
    if (searchChauffeur.isRealTimeDispatchNull === true) {
      queryBuilder.andWhere('chauffeur.real_time_dispatch_id IS NULL');
    }

    // 비상주 쇼퍼 필터링
    if (searchChauffeur.isNonResident === true) {
      queryBuilder.andWhere('chauffeur.type = :nonResidentType', {
        nonResidentType: ChauffeurType.NON_RESIDENT,
      });
    }

    queryBuilder.orderBy('chauffeur.id', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const chauffeurs = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const chauffeursResponse: ChauffeurResponseDto[] = chauffeurs.map((chauffeur) => ({
      id: chauffeur.id,
      name: chauffeur.name,
      phone: chauffeur.phone,
      birthDate: chauffeur.birth_date,
      profileImageUrl: chauffeur.profile_image_url,
      type: chauffeur.type,
      chauffeurStatus: chauffeur.chauffeur_status,
      vehicleId: chauffeur.vehicle_id,
      realTimeDispatchId: chauffeur.real_time_dispatch_id,
      role: chauffeur.role,
      status: chauffeur.status,
      createdBy: chauffeur.created_by,
      createdAt: chauffeur.created_at,
      updatedBy: chauffeur.updated_by,
      updatedAt: chauffeur.updated_at,
      // Vehicle 정보
      vehicle: chauffeur.vehicle_id
        ? {
            id: chauffeur.vehicle_id,
            vehicleNumber: chauffeur.vehicle_number,
            modelName: chauffeur.vehicle_model_name,
            garageId: chauffeur.vehicle_garage_id,
            vehicleStatus: chauffeur.vehicle_status,
            status: chauffeur.vehicle_data_status,
            createdBy: chauffeur.vehicle_created_by,
            createdAt: chauffeur.vehicle_created_at,
            updatedBy: chauffeur.vehicle_updated_by,
            updatedAt: chauffeur.vehicle_updated_at,
          }
        : null,
      // Garage 정보
      garage: chauffeur.garage_id
        ? {
            id: chauffeur.garage_id,
            name: chauffeur.garage_name,
            address: chauffeur.garage_address,
            status: chauffeur.garage_status,
            createdBy: chauffeur.garage_created_by,
            createdAt: chauffeur.garage_created_at,
            updatedBy: chauffeur.garage_updated_by,
            updatedAt: chauffeur.garage_updated_at,
          }
        : null,
    }));

    return [chauffeursResponse, totalCount];
  }

  async findById(id: number): Promise<Chauffeur> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async save(chauffeur: Chauffeur): Promise<void> {
    await this.repository.save(chauffeur);
  }

  async update(id: number, chauffeur: Partial<Chauffeur>): Promise<void> {
    await this.repository.update(id, chauffeur);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }

  async findAvailableChauffeurs(startTime: Date, endTime: Date): Promise<AvailableChauffeurDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('chauffeur')
      .leftJoin(Vehicle, 'vehicle', 'chauffeur.vehicle_id = vehicle.id')
      .leftJoin(Garage, 'garage', 'vehicle.garage_id = garage.id')
      .leftJoin('operation', 'operation', 'chauffeur.id = operation.chauffeur_id')
      .select('chauffeur.*')
      .addSelect('vehicle.id', 'vehicle_id')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('vehicle.garage_id', 'vehicle_garage_id')
      .addSelect('vehicle.vehicle_status', 'vehicle_status')
      .addSelect('vehicle.status', 'vehicle_data_status')
      .addSelect('garage.id', 'garage_id')
      .addSelect('garage.name', 'garage_name')
      .addSelect('garage.address', 'garage_address')
      .where('chauffeur.type IN (:...types)', {
        types: [ChauffeurType.HOSPITAL, ChauffeurType.EVENT],
      })
      .andWhere('chauffeur.status = :status', { status: DataStatus.REGISTER })
      .andWhere(
        `
        chauffeur.id NOT IN (
          SELECT DISTINCT operation.chauffeur_id
          FROM operation
          WHERE operation.chauffeur_id IS NOT NULL
            AND operation.status = :operationStatus
            AND (
              (operation.start_time <= :endTime AND operation.end_time >= :startTime)
              OR (operation.start_time IS NULL OR operation.end_time IS NULL)
            )
        )
      `,
      )
      .setParameters({
        operationStatus: DataStatus.REGISTER,
        startTime,
        endTime,
      })
      .orderBy('chauffeur.type', 'ASC')
      .addOrderBy('chauffeur.name', 'ASC');

    const chauffeurs = await queryBuilder.getRawMany();

    return chauffeurs.map((chauffeur) => ({
      id: chauffeur.id,
      name: chauffeur.name,
      phone: chauffeur.phone,
      birthDate: chauffeur.birth_date,
      profileImageUrl: chauffeur.profile_image_url,
      type: chauffeur.type,
      chauffeurStatus: chauffeur.chauffeur_status,
      vehicleId: chauffeur.vehicle_id,
      realTimeDispatchId: chauffeur.real_time_dispatch_id,
      role: chauffeur.role,
      status: chauffeur.status,
      vehicle: chauffeur.vehicle_id
        ? {
            id: chauffeur.vehicle_id,
            vehicleNumber: chauffeur.vehicle_number,
            modelName: chauffeur.vehicle_model_name,
            garageId: chauffeur.vehicle_garage_id,
            vehicleStatus: chauffeur.vehicle_status,
            status: chauffeur.vehicle_data_status,
          }
        : null,
      garage: chauffeur.garage_id
        ? {
            id: chauffeur.garage_id,
            name: chauffeur.garage_name,
            address: chauffeur.garage_address,
          }
        : null,
    }));
  }

  async updateLocation(id: number, latitude: number, longitude: number): Promise<void> {
    await this.repository.update(id, {
      latitude,
      longitude,
    });
  }
}
