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
  @ApiProperty({ description: '경유지 주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;
}
