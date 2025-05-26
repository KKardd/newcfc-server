import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class RealTimeDispatchResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  departureAddress: string;

  @ApiProperty()
  @Expose()
  destinationAddress: string;

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
