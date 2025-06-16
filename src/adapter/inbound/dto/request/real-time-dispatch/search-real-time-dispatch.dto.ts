import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchRealTimeDispatchDto {
  @ApiProperty({ description: '배차 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '배차 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '출발지 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ description: '도착지 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
