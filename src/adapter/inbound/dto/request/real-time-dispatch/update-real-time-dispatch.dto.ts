import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRealTimeDispatchDto {
  @ApiProperty({ description: '배차 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '배차 설명', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '출발지 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ description: '도착지 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;
}
