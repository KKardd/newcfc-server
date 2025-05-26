import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchRealTimeDispatchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
