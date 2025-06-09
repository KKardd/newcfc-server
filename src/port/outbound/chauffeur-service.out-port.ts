import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export abstract class ChauffeurServiceOutPort {
  abstract findAll(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<[ChauffeurResponseDto[], number]>;

  abstract findById(id: number): Promise<Chauffeur>;

  abstract save(chauffeur: Chauffeur): Promise<void>;

  abstract update(id: number, chauffeur: Partial<Chauffeur>): Promise<void>;

  abstract updateStatus(id: number, status: DataStatus): Promise<void>;
}
