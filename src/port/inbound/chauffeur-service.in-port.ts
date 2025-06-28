import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { AssignedVehicleResponseDto } from '@/adapter/inbound/dto/response/chauffeur/assigned-vehicle-response.dto';
import { ChauffeurProfileResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-profile-response.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import { ChauffeurStatusChangeResponseDto } from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import { CurrentOperationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/current-operation-response.dto';

export abstract class ChauffeurServiceInPort {
  abstract search(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>>;

  abstract detail(id: number): Promise<ChauffeurResponseDto>;

  abstract create(createChauffeur: CreateChauffeurDto): Promise<void>;

  abstract update(id: number, updateChauffeur: UpdateChauffeurDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract changeStatus(id: number, changeStatusDto: ChangeChauffeurStatusDto): Promise<ChauffeurStatusChangeResponseDto>;

  // 기사 전용 메서드들
  abstract getMyProfile(chauffeurId: number): Promise<ChauffeurProfileResponseDto>;

  abstract getMyAssignedVehicle(chauffeurId: number): Promise<AssignedVehicleResponseDto | null>;

  abstract getMyCurrentOperation(chauffeurId: number): Promise<CurrentOperationResponseDto | null>;
}
