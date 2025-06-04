import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class ReservationResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  operationId: number;

  @ApiProperty()
  @Expose()
  passengerName: string;

  @ApiProperty()
  @Expose()
  passengerPhone: string;

  @ApiProperty()
  @Expose()
  passengerEmail: string | null;

  @ApiProperty()
  @Expose()
  passengerCount: number;

  @ApiProperty()
  @Expose()
  safetyPhone: string | null;

  @ApiProperty()
  @Expose()
  memo: string | null;

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
