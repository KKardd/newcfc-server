import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class RealTimeDispatchResponseDto {
  @ApiProperty({ description: '배차 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '출발지 이름' })
  @Expose()
  departureName: string;

  @ApiProperty({ description: '출발지 주소' })
  @Expose()
  departureAddress: string;

  @ApiProperty({ description: '출발지 상세 주소' })
  @Expose()
  departureAddressDetail: string;

  @ApiProperty({ description: '목적지 이름' })
  @Expose()
  destinationName: string;

  @ApiProperty({ description: '목적지 주소' })
  @Expose()
  destinationAddress: string;

  @ApiProperty({ description: '목적지 상세 주소' })
  @Expose()
  destinationAddressDetail: string;

  @ApiProperty({ description: '배정된 기사 수' })
  @Expose()
  chauffeurCount: number;

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
