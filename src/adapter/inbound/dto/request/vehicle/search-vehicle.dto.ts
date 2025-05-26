import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class SearchVehicleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  garageId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(VehicleStatus)
  vehicleStatus?: VehicleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
