import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchWayPointDto {
  @ApiProperty({ description: '예약 ID', required: false })
  @IsOptional()
  @IsNumber()
  reservationId?: number;

  @ApiProperty({ description: '경유지 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '경유지 순서', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
