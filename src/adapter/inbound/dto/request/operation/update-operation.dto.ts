import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { OperationType } from '@/domain/enum/operation-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';

class WayPointUpdateDto {
  @ApiProperty({ description: '경유지 ID', required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '경유지 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '경유지 주소' })
  @IsString()
  address: string;

  @ApiProperty({ description: '경유지 상세 주소', required: false })
  @IsOptional()
  @IsString()
  addressDetail?: string;

  @ApiProperty({ description: '위도' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: '경도' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: '방문 시간', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  visitTime?: Date;

  @ApiProperty({ description: '순서 (order 재정렬 자동 적용)', example: 1 })
  @IsNumber()
  order: number;
}

export class UpdateOperationDto {
  @ApiProperty({ description: '운행 타입', enum: OperationType, required: false })
  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType;

  @ApiProperty({ description: '반복 운행 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isRepeated?: boolean;

  @ApiProperty({ description: '운행 시작 시간', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @ApiProperty({ description: '운행 종료 시간', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @ApiProperty({ description: '운행 거리(km)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;

  @ApiProperty({ description: '기사 ID', required: false })
  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @IsOptional()
  @IsNumber()
  realTimeDispatchId?: number;

  @ApiProperty({ description: '추가 비용', type: Object, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsObject()
  additionalCosts?: Record<string, number>;

  @ApiProperty({ description: '영수증 이미지 URL 목록', type: [String], required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    if (Array.isArray(value)) {
      return value;
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  receiptImageUrls?: string[];

  @ApiProperty({ description: '카카오 경로 정보', type: Object, required: false })
  @IsOptional()
  @IsObject()
  kakaoPath?: any;

  @ApiProperty({ description: '운행 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;

  @ApiProperty({ 
    description: '경유지 목록 (order 재정렬 자동 적용)', 
    type: [WayPointUpdateDto], 
    required: false,
    example: [
      {
        name: "서울역",
        address: "서울특별시 중구 세종대로 18",
        addressDetail: "1층",
        latitude: 37.5565,
        longitude: 126.9723,
        visitTime: "2025-01-18T10:30:00Z",
        order: 2
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WayPointUpdateDto)
  wayPoints?: WayPointUpdateDto[];
}
