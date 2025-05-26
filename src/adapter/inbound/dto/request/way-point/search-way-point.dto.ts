import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchWayPointDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  reservationId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
