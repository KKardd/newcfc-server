import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class ChauffeurInfoDto {
  @ApiProperty({ description: '기사 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '기사 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '생년월일' })
  @Expose()
  birthDate: string;

  @ApiProperty({ description: '프로필 사진 URL', required: false })
  @Expose()
  profileImageUrl: string | null;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType })
  @Expose()
  type: ChauffeurType;

  @ApiProperty({ description: '기사 상태', enum: ChauffeurStatus })
  @Expose()
  chauffeurStatus: ChauffeurStatus;

  @ApiProperty({ description: '차량 ID', required: false })
  @Expose()
  vehicleId: number | null;

  @ApiProperty({ description: '사용자 권한', enum: UserRoleType })
  @Expose()
  role: UserRoleType;

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

export class VehicleInfoDto {
  @ApiProperty({ description: '차량 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차량 번호' })
  @Expose()
  vehicleNumber: string;

  @ApiProperty({ description: '차량 모델명' })
  @Expose()
  modelName: string;

  @ApiProperty({ description: '차고지 ID' })
  @Expose()
  garageId: number;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus })
  @Expose()
  vehicleStatus: VehicleStatus;

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

export class GarageInfoDto {
  @ApiProperty({ description: '차고지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차고지 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '차고지 주소' })
  @Expose()
  address: string;

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

export class RealTimeDispatchInfoDto {
  @ApiProperty({ description: '실시간 배차 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '배차 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '배차 설명' })
  @Expose()
  description: string;

  @ApiProperty({ description: '출발지 주소' })
  @Expose()
  departureAddress: string;

  @ApiProperty({ description: '목적지 주소' })
  @Expose()
  destinationAddress: string;

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

export class ReservationInfoDto {
  @ApiProperty({ description: '예약 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '승객 이름' })
  @Expose()
  passengerName: string;

  @ApiProperty({ description: '승객 연락처' })
  @Expose()
  passengerPhone: string;

  @ApiProperty({ description: '승객 이메일', required: false })
  @Expose()
  passengerEmail: string | null;

  @ApiProperty({ description: '승객 수' })
  @Expose()
  passengerCount: number;

  @ApiProperty({ description: '안심 전화번호', required: false })
  @Expose()
  safetyPhone: string | null;

  @ApiProperty({ description: '메모', required: false })
  @Expose()
  memo: string | null;

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

export class WayPointInfoDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '주소' })
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

  @ApiProperty({ description: '순서' })
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

export class OperationResponseDto {
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
  startTime: Date | null;

  @ApiProperty({ description: '종료 시간', required: false })
  @Expose()
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

  @ApiProperty({ description: '추가 비용', required: false })
  @Expose()
  additionalCosts: Record<string, number> | null;

  @ApiProperty({ description: '영수증 이미지 URL 목록', required: false })
  @Expose()
  receiptImageUrls: string[] | null;

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
  chauffeur?: ChauffeurInfoDto | null;

  @ApiProperty({ description: '차량 정보', type: VehicleInfoDto, required: false })
  @Expose()
  vehicle?: VehicleInfoDto | null;

  @ApiProperty({ description: '차고지 정보', type: GarageInfoDto, required: false })
  @Expose()
  garage?: GarageInfoDto | null;

  @ApiProperty({ description: '실시간 배차 정보', type: RealTimeDispatchInfoDto, required: false })
  @Expose()
  realTimeDispatch?: RealTimeDispatchInfoDto | null;

  @ApiProperty({ description: '예약 정보', type: ReservationInfoDto, required: false })
  @Expose()
  reservation?: ReservationInfoDto | null;

  @ApiProperty({ description: '경유지 목록', type: [WayPointInfoDto] })
  @Expose()
  wayPoints: WayPointInfoDto[];

  @ApiProperty({ description: '카카오 경로 정보', required: false })
  @Expose()
  kakaoPath: any;
}
