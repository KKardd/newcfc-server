import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchWorkHistoryDto {
  @ApiProperty({ description: '기사 ID', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  chauffeurId?: number;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  vehicleId?: number;

  @ApiProperty({ description: '조회할 연도 (예: 2024)', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  year?: number;

  @ApiProperty({ description: '조회할 월 (1-12)', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  month?: number;

  @ApiProperty({ description: '시작일 (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  startDate?: string;

  @ApiProperty({ description: '종료일 (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  endDate?: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  status?: DataStatus;
}
