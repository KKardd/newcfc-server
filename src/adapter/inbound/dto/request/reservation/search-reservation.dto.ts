import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchReservationDto {
  @ApiProperty({ description: '운행 ID', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  operationId?: number;

  @ApiProperty({ description: '승객 이름', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerName?: string;

  @ApiProperty({ description: '승객 전화번호', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerPhone?: string;

  @ApiProperty({ description: '승객 이메일', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerEmail?: string;

  @ApiProperty({ description: '승객 수', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  passengerCount?: number;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  status?: DataStatus;
}
