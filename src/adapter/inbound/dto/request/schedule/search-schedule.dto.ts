import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchScheduleDto {
  @ApiProperty({ description: '운행 ID', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  operationId?: number;

  @ApiProperty({ description: '경유지 ID', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  wayPointId?: number;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus, required: false })
  @IsOptional()
  @IsEnum(ChauffeurStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  chauffeurStatus?: ChauffeurStatus;

  @ApiProperty({ description: '기록 시작 날짜', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ description: '기록 종료 날짜', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  status?: DataStatus;
}
