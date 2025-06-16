import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class DispatchPointResponseDto {
  @ApiProperty({ description: '배차 지점 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '배차 지점 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '배차 지점 주소' })
  @Expose()
  address: string;

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
