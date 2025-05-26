import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ReservationStatus } from '@/domain/enum/reservation-status.enum';

export class CreateReservationDto {
  @ApiProperty({ description: '출발지 주소' })
  @IsNotEmpty()
  @IsString()
  departureAddress: string;

  @ApiProperty({ description: '도착지 주소' })
  @IsNotEmpty()
  @IsString()
  destinationAddress: string;

  @ApiProperty({ description: '출발 시간' })
  @IsNotEmpty()
  @IsDate()
  departureTime: Date;

  @ApiProperty({ description: '기사 ID' })
  @IsNotEmpty()
  @IsNumber()
  chauffeurId: number;

  @ApiProperty({ description: '차량 ID' })
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @ApiProperty({ description: '예약 상태', enum: ReservationStatus })
  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  reservationStatus: ReservationStatus;
}
