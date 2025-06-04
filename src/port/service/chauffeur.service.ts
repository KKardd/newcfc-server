import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class ChauffeurService implements ChauffeurServiceInPort {
  constructor(private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort) {}

  async search(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>> {
    const [chauffeurs, totalCount] = await this.chauffeurServiceOutPort.findAll(searchChauffeur, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(ChauffeurResponseDto, chauffeurs, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<ChauffeurResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    return plainToInstance(ChauffeurResponseDto, chauffeur, classTransformDefaultOptions);
  }

  async create(createChauffeur: CreateChauffeurDto): Promise<void> {
    const chauffeur = plainToInstance(Chauffeur, createChauffeur);
    await this.chauffeurServiceOutPort.save(chauffeur);
  }

  async update(id: number, updateChauffeur: UpdateChauffeurDto): Promise<void> {
    await this.chauffeurServiceOutPort.update(id, updateChauffeur);
  }

  async delete(id: number): Promise<void> {
    await this.chauffeurServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }
}
