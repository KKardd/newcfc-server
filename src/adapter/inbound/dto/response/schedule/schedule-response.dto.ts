import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class ScheduleResponseDto {
  @ApiProperty({ description: '스케줄 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  wayPointId: number;

  @ApiProperty({ description: '기록 시간' })
  @Expose()
  recordedAt: Date;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus })
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus })
  @Expose()
  status: DataStatus;

  @ApiProperty({ description: '생성자 ID' })
  @Expose()
  createdBy: number;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '수정자 ID' })
  @Expose()
  updatedBy: number;

  @ApiProperty({ description: '수정일' })
  @Expose()
  updatedAt: Date;
}
