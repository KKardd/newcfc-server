import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchRealTimeDispatchDto {
  @ApiProperty({ description: '출발지 이름', required: false })
  @IsOptional()
  @IsString()
  departureName?: string;

  @ApiProperty({ description: '출발지 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ description: '목적지 이름', required: false })
  @IsOptional()
  @IsString()
  destinationName?: string;

  @ApiProperty({ description: '목적지 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
