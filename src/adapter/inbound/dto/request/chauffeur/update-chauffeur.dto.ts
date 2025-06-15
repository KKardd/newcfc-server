import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
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
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
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
