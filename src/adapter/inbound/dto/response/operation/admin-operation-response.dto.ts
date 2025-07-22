import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { KSTDateTransform } from '@/validate/serialization';

import {
  ChauffeurInfoDto,
  GarageInfoDto,
  RealTimeDispatchInfoDto,
  ReservationInfoDto,
  VehicleInfoDto,
} from './operation-response.dto';

// Schedule과 wayPoint 조합 정보를 위한 DTO
export class ScheduleHistoryDto {
  @ApiProperty({ description: 'wayPoint ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'wayPoint 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: 'wayPoint 주소', required: false })
  @Expose()
  address: string | null;

  @ApiProperty({ description: 'wayPoint 상세주소', required: false })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: 'wayPoint 순서' })
  @Expose()
  order: number;

  @ApiProperty({ description: '방문 시간 (Schedule 기록 시간)' })
  @Expose()
  visitTime: Date;

  @ApiProperty({ description: '예정 시간', required: false })
  @Expose()
  scheduledTime: Date | null;

  @ApiProperty({ description: '진행 상태 라벨' })
  @Expose()
  progressLabelStatus: string;
}

export class AdminWayPointInfoDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '경유지 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: '주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;

  @ApiProperty({ description: '방문 시간', required: false })
  @Expose()
  visitTime: Date | null;

  @ApiProperty({ description: '방문 예정 시간', required: false })
  @Expose()
  scheduledTime: Date | null;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus, required: false })
  @Expose()
  chauffeurStatus: ChauffeurStatus | null;

  @ApiProperty({
    description: '진행 상태',
    example: 'PENDING',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
  })
  @Expose()
  progressStatus: string;

  @ApiProperty({
    description: '진행 상태 라벨 (한국어)',
    example: '출발지이동',
  })
  @Expose()
  progressLabel: string;

  @ApiProperty({
    description: '진행 라벨 관련 기사 상태',
    enum: ChauffeurStatus,
    required: false,
  })
  @Expose()
  progressLabelStatus: ChauffeurStatus | null;

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

export class AdminOperationResponseDto {
  @ApiProperty({ description: '운행 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 타입', enum: OperationType })
  @Expose()
  type: OperationType;

  @ApiProperty({ description: '반복 여부' })
  @Expose()
  isRepeated: boolean;

  @ApiProperty({ description: '시작 시간', required: false })
  @Expose()
  @KSTDateTransform
  startTime: Date | null;

  @ApiProperty({ description: '종료 시간', required: false })
  @Expose()
  @KSTDateTransform
  endTime: Date | null;

  @ApiProperty({ description: '이동 거리(km)', required: false })
  @Expose()
  distance: number | null;

  @ApiProperty({ description: '기사 ID', required: false })
  @Expose()
  chauffeurId: number | null;

  @ApiProperty({ description: '기사 이름', required: false })
  @Expose()
  chauffeurName: string | null;

  @ApiProperty({ description: '기사 전화번호', required: false })
  @Expose()
  chauffeurPhone: string | null;

  @ApiProperty({ description: '탑승 인원 수', required: false })
  @Expose()
  passengerCount: number | null;

  @ApiProperty({ description: '차량 ID', required: false })
  @Expose()
  vehicleId: number | null;

  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @Expose()
  realTimeDispatchId: number | null;

  @ApiProperty({ description: '담당자 이름', required: false })
  @Expose()
  managerName: string | null;

  @ApiProperty({ description: '담당자 전화번호', required: false })
  @Expose()
  managerNumber: string | null;

  @ApiProperty({ description: '추가 비용', required: false })
  @Expose()
  additionalCosts: Record<string, number> | null;

  @ApiProperty({ description: '영수증 이미지 URL 목록', required: false })
  @Expose()
  receiptImageUrls: string[] | null;

  @ApiProperty({ description: '카카오 경로 정보', required: false })
  @Expose()
  kakaoPath: unknown | null;

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

  @ApiProperty({ description: '기사 정보', type: ChauffeurInfoDto, required: false })
  @Expose()
  chauffeur: ChauffeurInfoDto | null;

  @ApiProperty({ description: '차량 정보', type: VehicleInfoDto, required: false })
  @Expose()
  vehicle: VehicleInfoDto | null;

  @ApiProperty({ description: '차고지 정보', type: GarageInfoDto, required: false })
  @Expose()
  garage: GarageInfoDto | null;

  @ApiProperty({ description: '실시간 배차 정보', type: RealTimeDispatchInfoDto, required: false })
  @Expose()
  realTimeDispatch: RealTimeDispatchInfoDto | null;

  @ApiProperty({ description: '예약 정보', type: ReservationInfoDto, required: false })
  @Expose()
  reservation: ReservationInfoDto | null;

  @ApiProperty({
    description: '진행 상태가 포함된 경유지 목록',
    type: [AdminWayPointInfoDto],
  })
  @Expose()
  wayPoints: AdminWayPointInfoDto[];

  @ApiProperty({
    description: '기사 상태 변경 기록',
    type: [ScheduleHistoryDto],
  })
  @Expose()
  schedules: ScheduleHistoryDto[];
}
