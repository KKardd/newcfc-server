import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchChauffeurDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  birthDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ChauffeurType)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  type?: ChauffeurType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ChauffeurStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  chauffeurStatus?: ChauffeurStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  status?: DataStatus;
}
