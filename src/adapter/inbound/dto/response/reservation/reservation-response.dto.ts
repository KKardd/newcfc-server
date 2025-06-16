import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class ReservationResponseDto {
  @ApiProperty({ description: '예약 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '승객 이름' })
  @Expose()
  passengerName: string;

  @ApiProperty({ description: '승객 연락처' })
  @Expose()
  passengerPhone: string;

  @ApiProperty({ description: '승객 이메일', required: false })
  @Expose()
  passengerEmail: string | null;

  @ApiProperty({ description: '승객 수' })
  @Expose()
  passengerCount: number;

  @ApiProperty({ description: '안심 전화번호', required: false })
  @Expose()
  safetyPhone: string | null;

  @ApiProperty({ description: '메모', required: false })
  @Expose()
  memo: string | null;

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
