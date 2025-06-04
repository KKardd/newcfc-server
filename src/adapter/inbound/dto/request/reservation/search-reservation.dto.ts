import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchReservationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  operationId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  passengerEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  passengerCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  status?: DataStatus;
}
