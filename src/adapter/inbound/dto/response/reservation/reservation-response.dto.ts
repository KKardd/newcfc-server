import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationStatus } from '@/domain/enum/reservation-status.enum';

export class ReservationResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  departureAddress: string;

  @ApiProperty()
  @Expose()
  destinationAddress: string;

  @ApiProperty()
  @Expose()
  departureTime: Date;

  @ApiProperty()
  @Expose()
  chauffeurId: number;

  @ApiProperty()
  @Expose()
  vehicleId: number;

  @ApiProperty()
  @Expose()
  reservationStatus: ReservationStatus;

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
