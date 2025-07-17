import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';

export class CurrentReservationDto {
  @ApiProperty({ description: '예약 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '승객 이름' })
  @Expose()
  passengerName: string;

  @ApiProperty({ description: '승객 전화번호' })
  @Expose()
  passengerPhone: string;

  @ApiProperty({ description: '승객 수' })
  @Expose()
  passengerCount: number;

  @ApiProperty({ description: '안전 연락망', required: false })
  @Expose()
  safetyPhone: string | null;

  @ApiProperty({ description: '메모', required: false })
  @Expose()
  memo: string | null;
}

export class CurrentWayPointDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '경유지 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: '주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '상세주소', required: false })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: '위도', required: false })
  @Expose()
  latitude: number | null;

  @ApiProperty({ description: '경도', required: false })
  @Expose()
  longitude: number | null;

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus, required: false })
  @Expose()
  chauffeurStatus: ChauffeurStatus | null;

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
}

export class CurrentOperationResponseDto {
  @ApiProperty({ description: '운행 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 타입', enum: OperationType })
  @Expose()
  type: OperationType;

  @ApiProperty({ description: '시작 시간', required: false })
  @Expose()
  startTime: Date | null;

  @ApiProperty({ description: '종료 시간', required: false })
  @Expose()
  endTime: Date | null;

  @ApiProperty({ description: '거리', required: false })
  @Expose()
  distance: number | null;

  @ApiProperty({ description: '예약 정보', type: CurrentReservationDto, required: false })
  @Expose()
  @Type(() => CurrentReservationDto)
  reservation: CurrentReservationDto | null;

  @ApiProperty({ description: '현재 진행 중인 경유지', type: CurrentWayPointDto, required: false })
  @Expose()
  @Type(() => CurrentWayPointDto)
  currentWayPoint: CurrentWayPointDto | null;

  @ApiProperty({ description: '경유지 목록', type: [CurrentWayPointDto] })
  @Expose()
  @Type(() => CurrentWayPointDto)
  wayPoints: CurrentWayPointDto[];

  @ApiProperty({ description: '출발지 주소', required: false })
  @Expose()
  departureAddress: string | null;

  @ApiProperty({ description: '도착지 주소', required: false })
  @Expose()
  destinationAddress: string | null;
}
