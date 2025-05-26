import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchDispatchPointDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
