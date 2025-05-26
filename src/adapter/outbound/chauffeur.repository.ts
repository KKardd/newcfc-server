import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';

@Injectable()
export class ChauffeurRepository implements ChauffeurServiceOutPort {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly repository: Repository<Chauffeur>,
  ) {}

  async findAll(searchChauffeur: SearchChauffeurDto, paginationQuery: PaginationQuery): Promise<[Chauffeur[], number]> {
    const query = this.repository.createQueryBuilder('chauffeur');

    if (searchChauffeur.name) {
      query.andWhere('chauffeur.name LIKE :name', {
        name: `%${searchChauffeur.name}%`,
      });
    }

    if (searchChauffeur.phone) {
      query.andWhere('chauffeur.phone LIKE :phone', {
        phone: `%${searchChauffeur.phone}%`,
      });
    }

    if (searchChauffeur.birthDate) {
      query.andWhere('chauffeur.birthDate = :birthDate', {
        birthDate: searchChauffeur.birthDate,
      });
    }

    if (searchChauffeur.type) {
      query.andWhere('chauffeur.type = :type', {
        type: searchChauffeur.type,
      });
    }

    if (searchChauffeur.chauffeurStatus) {
      query.andWhere('chauffeur.chauffeurStatus = :chauffeurStatus', {
        chauffeurStatus: searchChauffeur.chauffeurStatus,
      });
    }

    if (searchChauffeur.status) {
      query.andWhere('chauffeur.status = :status', {
        status: searchChauffeur.status,
      });
    }

    return await query.skip(paginationQuery.skip).take(paginationQuery.countPerPage).getManyAndCount();
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
