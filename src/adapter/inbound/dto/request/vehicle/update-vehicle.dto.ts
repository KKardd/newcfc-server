import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsNumber()
  garageId?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  vehicleStatus?: VehicleStatus;
}
