import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

export class WayPointResponseDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '경유지 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: '경유지 주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus, required: false })
  @Expose()
  chauffeurStatus: ChauffeurStatus | null;

  @ApiProperty({ description: '위도', required: false })
  @Expose()
  latitude: number | null;

  @ApiProperty({ description: '경도', required: false })
  @Expose()
  longitude: number | null;

  @ApiProperty({ description: '방문 예정 시간', required: false })
  @Expose()
  visitTime: Date | null;

  @ApiProperty({ description: '방문 예정 시간', required: false })
  @Expose()
  scheduledTime: Date | null;

  @ApiProperty({ description: '방문 날짜 (YYYY-MM-DD)', required: false })
  @Expose()
  get date(): string | null {
    return this.scheduledTime ? this.scheduledTime.toISOString().split('T')[0] : null;
  }

  @ApiProperty({ description: '방문 시각 (HH:mm)', required: false })
  @Expose()
  get time(): string | null {
    return this.scheduledTime ? this.scheduledTime.toTimeString().slice(0, 5) : null;
  }

  @ApiProperty({ description: '경유지 순서' })
  @Expose()
  order: number;

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
