import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class CreateVehicleDto {
  @ApiProperty({ description: '차량 번호' })
  @IsNotEmpty()
  @IsString()
  vehicleNumber: string;

  @ApiProperty({ description: '차량 모델명' })
  @IsNotEmpty()
  @IsString()
  modelName: string;

  @ApiProperty({ description: '차고지 ID' })
  @IsNotEmpty()
  @IsNumber()
  garageId: number;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus })
  @IsNotEmpty()
  @IsEnum(VehicleStatus)
  vehicleStatus: VehicleStatus;
}
