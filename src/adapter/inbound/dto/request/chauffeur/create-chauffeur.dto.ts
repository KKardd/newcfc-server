import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';

export class CreateChauffeurDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(ChauffeurType)
  type: ChauffeurType;

  @IsOptional()
  vehicleId?: number;
}
