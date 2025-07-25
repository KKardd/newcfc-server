import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

export class CreateScheduleDto {
  @ApiProperty({ description: '운행 ID' })
  @IsNotEmpty()
  @IsNumber()
  operationId: number;

  @ApiProperty({ description: '경유지 ID', required: false })
  @IsOptional()
  @IsNumber()
  wayPointId?: number | null;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus })
  @IsNotEmpty()
  @IsEnum(ChauffeurStatus)
  chauffeurStatus: ChauffeurStatus;
}
