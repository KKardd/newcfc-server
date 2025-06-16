import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWayPointDto {
  @ApiProperty({ description: '예약 ID', required: false })
  @IsOptional()
  @IsNumber()
  reservationId?: number;

  @ApiProperty({ description: '경유지 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '경유지 순서', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
