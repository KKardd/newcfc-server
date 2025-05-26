import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(ChauffeurType)
  type: ChauffeurType;

  @IsOptional()
  vehicleId?: number;
}
