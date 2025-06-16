import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWayPointDto {
  @ApiProperty({ description: '예약 ID' })
  @IsNotEmpty()
  @IsNumber()
  reservationId: number;

  @ApiProperty({ description: '경유지 주소' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: '경유지 순서' })
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
