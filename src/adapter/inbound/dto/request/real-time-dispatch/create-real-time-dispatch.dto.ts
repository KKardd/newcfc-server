import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRealTimeDispatchDto {
  @ApiProperty({ description: '출발지 이름' })
  @IsNotEmpty()
  @IsString()
  departureName: string;

  @ApiProperty({ description: '출발지 주소' })
  @IsNotEmpty()
  @IsString()
  departureAddress: string;

  @ApiProperty({ description: '출발지 상세 주소', required: false })
  @IsOptional()
  @IsString()
  departureAddressDetail?: string;

  @ApiProperty({ description: '목적지 이름' })
  @IsNotEmpty()
  @IsString()
  destinationName: string;

  @ApiProperty({ description: '목적지 주소' })
  @IsNotEmpty()
  @IsString()
  destinationAddress: string;

  @ApiProperty({ description: '목적지 상세 주소', required: false })
  @IsOptional()
  @IsString()
  destinationAddressDetail?: string;
}
