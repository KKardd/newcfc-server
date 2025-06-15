import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import { OperationType } from '@/domain/enum/operation-type.enum';

export class UpdateOperationDto {
  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType;

  @IsOptional()
  @IsBoolean()
  isRepeated?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @IsOptional()
  @IsNumber()
  realTimeDispatchId?: number;

  @IsOptional()
  @IsObject()
  additionalCosts?: Record<string, number>;

  @IsOptional()
  @IsString({ each: true })
  receiptImageUrls?: string[];
}
