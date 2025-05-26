import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SearchChauffeurDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ChauffeurType)
  type?: ChauffeurType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ChauffeurStatus)
  chauffeurStatus?: ChauffeurStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
