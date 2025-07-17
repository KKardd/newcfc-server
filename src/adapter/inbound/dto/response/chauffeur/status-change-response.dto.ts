import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

export class ChauffeurStatusChangeResponseDto {
  @ApiProperty({ description: '변경된 상태', enum: ChauffeurStatus })
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty({ description: '운행 시간 (분)', required: false })
  @Expose()
  operationTimeMinutes?: number;

  @ApiProperty({ description: '안심 전화번호', required: false })
  @Expose()
  safetyPhone?: string;

  @ApiProperty({ description: '경유지 존재 여부', required: false })
  @Expose()
  hasWayPoints?: boolean;

  @ApiProperty({ description: '목적지 주소', required: false })
  @Expose()
  destinationAddress?: string;

  @ApiProperty({ description: '경유지 목록', required: false, type: () => [WayPointInfo] })
  @Expose()
  wayPoints?: WayPointInfo[];
}

export class WayPointInfo {
  @ApiProperty({ description: '경유지 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: '경유지 주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: '방문 시간', required: false })
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

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;
}
