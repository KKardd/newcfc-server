import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';

export class SearchOperationDto {
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

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
