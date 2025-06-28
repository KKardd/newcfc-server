import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class AssignedVehicleResponseDto {
  @ApiProperty({ description: '차량 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차량 번호' })
  @Expose()
  vehicleNumber: string;

  @ApiProperty({ description: '차량 모델명' })
  @Expose()
  modelName: string;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus })
  @Expose()
  vehicleStatus: VehicleStatus;
}
