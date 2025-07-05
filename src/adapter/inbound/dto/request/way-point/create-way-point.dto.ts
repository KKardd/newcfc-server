import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWayPointDto {
  @ApiProperty({ description: '운행 ID' })
  @IsNotEmpty()
  @IsNumber()
  operationId: number;

  @ApiProperty({ description: '경유지 주소' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @IsOptional()
  @IsString()
  addressDetail?: string;

  @ApiProperty({ description: '위도', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: '경도', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: '경유지 순서' })
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
