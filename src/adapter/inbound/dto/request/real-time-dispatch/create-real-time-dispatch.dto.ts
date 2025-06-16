import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRealTimeDispatchDto {
  @ApiProperty({ description: '배차 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '배차 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '출발지 주소' })
  @IsNotEmpty()
  @IsString()
  departureAddress: string;

  @ApiProperty({ description: '도착지 주소' })
  @IsNotEmpty()
  @IsString()
  destinationAddress: string;
}
