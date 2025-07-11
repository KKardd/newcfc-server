import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import { OperationType } from '@/domain/enum/operation-type.enum';

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
  @IsObject()
  additionalCosts?: Record<string, number>;

  @ApiProperty({ description: '영수증 이미지 URL 목록', type: [String], required: false })
  @IsOptional()
  @IsString({ each: true })
  receiptImageUrls?: string[];

  @ApiProperty({ description: '카카오 경로 정보', type: Object, required: false })
  @IsOptional()
  @IsObject()
  kakaoPath?: any;
}
