import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class GarageResponseDto {
  @ApiProperty({ description: '차고지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차고지 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '차고지 주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '배정된 차량 개수' })
  @Expose()
  vehicleCount: number;

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
