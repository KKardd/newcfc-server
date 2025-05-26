import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { ReservationStatus } from '@/domain/enum/reservation-status.enum';

export class SearchReservationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  departureTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ReservationStatus)
  reservationStatus?: ReservationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
