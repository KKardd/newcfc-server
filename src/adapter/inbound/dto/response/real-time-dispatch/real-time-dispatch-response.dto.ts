import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class RealTimeDispatchResponseDto {
  @ApiProperty({ description: '배차 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '배차 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '배차 설명' })
  @Expose()
  description: string;

  @ApiProperty({ description: '출발지 주소' })
  @Expose()
  departureAddress: string;

  @ApiProperty({ description: '도착지 주소' })
  @Expose()
  destinationAddress: string;

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
