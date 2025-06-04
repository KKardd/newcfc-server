import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto {
  @ApiProperty({ description: '운행 ID', required: false })
  @IsOptional()
  @IsNumber()
  operationId?: number;

  @ApiProperty({ description: '승객 이름', required: false })
  @IsOptional()
  @IsString()
  passengerName?: string;

  @ApiProperty({ description: '승객 전화번호', required: false })
  @IsOptional()
  @IsString()
  passengerPhone?: string;

  @ApiProperty({ description: '승객 이메일', required: false })
  @IsOptional()
  @IsString()
  passengerEmail?: string;

  @ApiProperty({ description: '승객 수', required: false })
  @IsOptional()
  @IsNumber()
  passengerCount?: number;

  @ApiProperty({ description: '비상 연락처', required: false })
  @IsOptional()
  @IsString()
  safetyPhone?: string;

  @ApiProperty({ description: '메모', required: false })
  @IsOptional()
  @IsString()
  memo?: string;
}
