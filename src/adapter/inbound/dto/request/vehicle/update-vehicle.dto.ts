import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class UpdateVehicleDto {
  @ApiProperty({ description: '차량 번호', required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ description: '차량 모델명', required: false })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiProperty({ description: '차고지 ID', required: false })
  @IsOptional()
  @IsNumber()
  garageId?: number;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus, required: false })
  @IsOptional()
  @IsEnum(VehicleStatus)
  vehicleStatus?: VehicleStatus;
}
