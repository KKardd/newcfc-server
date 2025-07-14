import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, UpdateResult, Like } from 'typeorm';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';

@Injectable()
export class ChauffeurRepository implements ChauffeurServiceOutPort {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
  ) {}

  async findAll(search: SearchChauffeurDto, paginationQuery: PaginationQuery, status?: string): Promise<[Chauffeur[], number]> {
    const queryBuilder = this.chauffeurRepository
      .createQueryBuilder('chauffeur')
      .leftJoinAndSelect('chauffeur.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.garage', 'garage');

    // 기본 검색 필드들
    if (search.name) {
      queryBuilder.andWhere('chauffeur.name LIKE :name', { name: `%${search.name}%` });
    }

    if (search.phone) {
      queryBuilder.andWhere('chauffeur.phone LIKE :phone', { phone: `%${search.phone}%` });
    }

    if (search.birthDate) {
      queryBuilder.andWhere('chauffeur.birthDate = :birthDate', { birthDate: search.birthDate });
    }

    if (search.type) {
      queryBuilder.andWhere('chauffeur.type = :type', { type: search.type });
    }

    if (search.chauffeurStatus) {
      queryBuilder.andWhere('chauffeur.chauffeurStatus = :chauffeurStatus', { chauffeurStatus: search.chauffeurStatus });
    }

    if (search.realTimeDispatchId !== undefined) {
      queryBuilder.andWhere('chauffeur.realTimeDispatchId = :realTimeDispatchId', {
        realTimeDispatchId: search.realTimeDispatchId,
      });
    }

    if (search.isVehicleAssigned !== undefined) {
      queryBuilder.andWhere('chauffeur.isVehicleAssigned = :isVehicleAssigned', { isVehicleAssigned: search.isVehicleAssigned });
    }

    // 실시간 배차지가 null인 기사만 조회
    if (search.isRealTimeDispatchNull === true) {
      queryBuilder.andWhere('chauffeur.realTimeDispatchId IS NULL');
    }

    // 비상주 쇼퍼만 조회
    if (search.isNonResident === true) {
      queryBuilder.andWhere('chauffeur.type = :nonResident', { nonResident: 'NON_RESIDENT' });
    }

    // 상태 필터링
    if (status === DataStatus.DELETED) {
      queryBuilder.andWhere('chauffeur.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });
    } else if (status) {
      queryBuilder.andWhere('chauffeur.status = :status', { status });
    }

    queryBuilder.orderBy('chauffeur.createdAt', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Chauffeur | null> {
    return this.chauffeurRepository
      .createQueryBuilder('chauffeur')
      .leftJoinAndSelect('chauffeur.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.garage', 'garage')
      .where('chauffeur.id = :id', { id })
      .getOne();
  }

  async findByVehicleId(vehicleId: number): Promise<Chauffeur[]> {
    return this.chauffeurRepository.find({
      where: {
        vehicleId: vehicleId,
        isVehicleAssigned: true,
        status: Not(DataStatus.DELETED),
      },
    });
  }

  async findAvailableChauffeurs(startTime: Date, endTime: Date): Promise<Chauffeur[]> {
    // 실제 구현 필요
    return [];
  }

  async updateLocation(id: number, latitude: number, longitude: number): Promise<UpdateResult> {
    return this.chauffeurRepository.update(id, { latitude, longitude });
  }

  async save(chauffeur: Chauffeur): Promise<Chauffeur> {
    return this.chauffeurRepository.save(chauffeur);
  }

  async update(id: number, chauffeur: Partial<Chauffeur>) {
    return this.chauffeurRepository.update(id, chauffeur);
  }
}
