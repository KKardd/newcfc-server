import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ReservationStatus } from '@/domain/enum/reservation-status.enum';

export class UpdateReservationDto {
  @ApiProperty({ description: '출발지 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ description: '도착지 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @ApiProperty({ description: '출발 시간', required: false })
  @IsOptional()
  @IsDate()
  departureTime?: Date;

  @ApiProperty({ description: '기사 ID', required: false })
  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ description: '예약 상태', enum: ReservationStatus, required: false })
  @IsOptional()
  @IsEnum(ReservationStatus)
  reservationStatus?: ReservationStatus;
}
