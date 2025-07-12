import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, UpdateResult } from 'typeorm';
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
    // TODO: search 필드별 where 조건 추가
    if (status === 'delete') {
      where.status = Not('delete');
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
