import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchDispatchPointDto {
  @ApiProperty({ description: '배차 지점 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '배차 지점 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
