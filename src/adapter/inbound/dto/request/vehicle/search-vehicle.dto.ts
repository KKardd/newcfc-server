import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class SearchVehicleDto {
  @ApiProperty({ description: '차량 번호', required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ description: '차량 모델명', required: false })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiProperty({ description: '차고지 ID', required: false })
  @IsOptional()
  @IsNumber()
  garageId?: number;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus, required: false })
  @IsOptional()
  @IsEnum(VehicleStatus)
  vehicleStatus?: VehicleStatus;

  @ApiProperty({ description: '배정 여부 (기사가 배정되었는지 여부: true=배정됨, false=미배정)', required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    if (value === '1' || value === 1) return true;
    if (value === '0' || value === 0) return false;
    return value;
  })
  assigned?: boolean | string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
