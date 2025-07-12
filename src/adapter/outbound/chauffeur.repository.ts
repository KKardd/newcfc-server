import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { CustomRepository } from '@/util/custom-repository.decorator';
import { CustomRepository as BaseRepository } from './custom.repository';
import { UpdateResult } from 'typeorm';

@CustomRepository(Chauffeur)
export class ChauffeurRepository extends BaseRepository<Chauffeur> implements ChauffeurServiceOutPort {
  async findAll(search: SearchChauffeurDto, paginationQuery: PaginationQuery): Promise<[Chauffeur[], number]> {
    const queryBuilder = this.createQueryBuilder('chauffeur');

    // ... (rest of the filtering logic from the original file)

    queryBuilder.orderBy('chauffeur.createdAt', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: number): Promise<Chauffeur> {
    return this.findOneOrFail({ where: { id } });
  }

  async findAvailableChauffeurs(startTime: Date, endTime: Date): Promise<Chauffeur[]> {
    // This logic needs to be carefully reimplemented
    // For now, returning an empty array as a placeholder
    return [];
  }

  async updateLocation(id: number, latitude: number, longitude: number): Promise<UpdateResult> {
    return this.update(id, { latitude, longitude });
  }

  async updateStatus(id: number, status: DataStatus) {
    return this.update(id, { status });
  }
}
