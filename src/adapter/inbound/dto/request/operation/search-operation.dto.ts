import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';

export class SearchOperationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRepeated?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  realTimeDispatchId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;
}
