import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';

export class OperationResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  type: OperationType;

  @ApiProperty()
  @Expose()
  isRepeated: boolean;

  @ApiProperty()
  @Expose()
  startTime: Date | null;

  @ApiProperty()
  @Expose()
  endTime: Date | null;

  @ApiProperty()
  @Expose()
  distance: number | null;

  @ApiProperty()
  @Expose()
  chauffeurId: number | null;

  @ApiProperty()
  @Expose()
  vehicleId: number | null;

  @ApiProperty()
  @Expose()
  realTimeDispatchId: number | null;

  @ApiProperty()
  @Expose()
  additionalCosts: Record<string, number> | null;

  @ApiProperty()
  @Expose()
  receiptImageUrls: string[] | null;

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
