import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class WayPointResponseDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '예약 ID' })
  @Expose()
  reservationId: number;

  @ApiProperty({ description: '경유지 주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '경유지 순서' })
  @Expose()
  order: number;

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
