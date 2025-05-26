import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';

export class UpdateChauffeurDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(ChauffeurType)
  type?: ChauffeurType;

  @IsOptional()
  @IsEnum(ChauffeurStatus)
  chauffeurStatus?: ChauffeurStatus;

  @IsOptional()
  vehicleId?: number;
}
