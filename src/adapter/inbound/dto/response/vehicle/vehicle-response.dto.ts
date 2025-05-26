import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class VehicleResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  vehicleNumber: string;

  @ApiProperty()
  @Expose()
  modelName: string;

  @ApiProperty()
  @Expose()
  garageId: number;

  @ApiProperty()
  @Expose()
  vehicleStatus: VehicleStatus;

  @ApiProperty()
  @Expose()
  status: DataStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
