import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class VehicleResponseDto {
  @ApiProperty({ description: '차량 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차량 번호' })
  @Expose()
  vehicleNumber: string;

  @ApiProperty({ description: '차량 모델명' })
  @Expose()
  modelName: string;

  @ApiProperty({ description: '차고지 ID' })
  @Expose()
  garageId: number;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus })
  @Expose()
  vehicleStatus: VehicleStatus;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus })
  @Expose()
  status: DataStatus;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @Expose()
  updatedAt: Date;
}
