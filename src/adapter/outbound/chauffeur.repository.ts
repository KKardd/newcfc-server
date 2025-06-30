import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';

@Injectable()
export class ChauffeurRepository implements ChauffeurServiceOutPort {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly repository: Repository<Chauffeur>,
  ) {}

  async findAll(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<[ChauffeurResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('chauffeur')
      .leftJoin('vehicle', 'vehicle', 'chauffeur.vehicle_id = vehicle.id')
      .leftJoin('garage', 'garage', 'vehicle.garage_id = garage.id')
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
      .addSelect('garage.updated_at', 'garage_updated_at');

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
}
