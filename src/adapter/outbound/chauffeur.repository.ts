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
    const where: any = {};

    // 기본 검색 필드들
    if (search.name) where.name = Like(`%${search.name}%`);
    if (search.phone) where.phone = Like(`%${search.phone}%`);
    if (search.birthDate) where.birthDate = search.birthDate;
    if (search.type) where.type = search.type;
    if (search.chauffeurStatus) where.chauffeurStatus = search.chauffeurStatus;
    if (search.realTimeDispatchId !== undefined) where.realTimeDispatchId = search.realTimeDispatchId;
    if (search.isVehicleAssigned !== undefined) where.isVehicleAssigned = search.isVehicleAssigned;

    // 실시간 배차지가 null인 기사만 조회
    if (search.isRealTimeDispatchNull === true) {
      where.realTimeDispatchId = null;
    }

    // 비상주 쇼퍼만 조회
    if (search.isNonResident === true) {
      where.type = 'NON_RESIDENT';
    }

    // 상태 필터링
    if (status === DataStatus.DELETED) {
      where.status = Not(DataStatus.DELETED);
    } else if (status) {
      where.status = status;
    }

    return this.chauffeurRepository.findAndCount({
      skip: paginationQuery.skip,
      take: paginationQuery.countPerPage,
      order: { createdAt: 'DESC' },
      where,
    });
  }

  async findById(id: number): Promise<Chauffeur | null> {
    return this.chauffeurRepository.findOne({ where: { id } });
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
