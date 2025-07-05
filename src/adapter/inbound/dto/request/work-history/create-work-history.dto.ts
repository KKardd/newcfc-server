import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkHistoryDto {
  @ApiProperty({ description: '기사 ID' })
  @IsNumber()
  chauffeurId: number;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ description: '근무 시작 시간' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: '메모', required: false })
  @IsOptional()
  @IsString()
  memo?: string;
}
