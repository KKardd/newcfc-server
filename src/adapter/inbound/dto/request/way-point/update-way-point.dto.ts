import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWayPointDto {
  @ApiProperty({ description: '운행 ID', required: false })
  @IsOptional()
  @IsNumber()
  operationId?: number;

  @ApiProperty({ description: '경유지 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '경유지 주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

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

  @ApiProperty({ description: '방문 예정 시간', required: false, type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  visitTime?: string;

  @ApiProperty({ description: '경유지 순서', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
