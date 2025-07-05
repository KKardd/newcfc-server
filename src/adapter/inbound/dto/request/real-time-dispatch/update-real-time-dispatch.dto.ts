import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRealTimeDispatchDto {
  @ApiProperty({ description: '출발지 이름', required: false })
  @IsOptional()
  @IsString()
  departureName?: string;

  @ApiProperty({ description: '출발지 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddress?: string;

  @ApiProperty({ description: '목적지 이름', required: false })
  @IsOptional()
  @IsString()
  destinationName?: string;

  @ApiProperty({ description: '목적지 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddress?: string;
}
