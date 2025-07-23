import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UpdateResult } from 'typeorm';

export abstract class ChauffeurServiceOutPort {
  abstract findAll(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
    status?: string,
  ): Promise<[Chauffeur[], number]>;

  abstract findById(id: number): Promise<Chauffeur | null>;

  abstract findByVehicleId(vehicleId: number): Promise<Chauffeur[]>;

  abstract save(chauffeur: Chauffeur): Promise<Chauffeur>;

  abstract update(id: number, chauffeur: Partial<Chauffeur>): Promise<UpdateResult>;

  abstract findAvailableChauffeurs(startTime: Date, endTime: Date): Promise<Chauffeur[]>;

  abstract findAvailableChauffeursForReservation(startTime: Date, endTime: Date): Promise<Chauffeur[]>;

  // 위치 관련 메서드
  abstract updateLocation(id: number, latitude: number, longitude: number): Promise<UpdateResult>;
}
