import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  vehicleNumber: string;

  @IsNotEmpty()
  @IsString()
  modelName: string;

  @IsNotEmpty()
  @IsNumber()
  garageId: number;

  @IsNotEmpty()
  @IsEnum(VehicleStatus)
  vehicleStatus: VehicleStatus;
}
