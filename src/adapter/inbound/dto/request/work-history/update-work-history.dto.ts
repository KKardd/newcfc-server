import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWorkHistoryDto {
  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ description: '근무 시작 시간', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: '근무 종료 시간', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: '총 근무 시간(분)', required: false })
  @IsOptional()
  @IsNumber()
  totalMinutes?: number;

  @ApiProperty({ description: '메모', required: false })
  @IsOptional()
  @IsString()
  memo?: string;
}
