import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

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

  @ApiProperty({ description: '기사 정보', required: false })
  @Expose()
  chauffeur?: {
    id: number;
    name: string;
    phone: string;
    birthDate: string;
    profileImageUrl: string | null;
    type: ChauffeurType;
    chauffeurStatus: ChauffeurStatus;
    vehicleId: number | null;
    role: UserRoleType;
    status: DataStatus;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
  } | null;

  @ApiProperty({ description: '차량 정보', required: false })
  @Expose()
  vehicle?: {
    id: number;
    vehicleNumber: string;
    modelName: string;
    garageId: number;
    vehicleStatus: VehicleStatus;
    status: DataStatus;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
  } | null;

  @ApiProperty({ description: '차고지 정보', required: false })
  @Expose()
  garage?: {
    id: number;
    name: string;
    address: string;
    status: DataStatus;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
  } | null;

  @ApiProperty({ description: '실시간 배차 정보', required: false })
  @Expose()
  realTimeDispatch?: {
    id: number;
    name: string;
    description: string;
    departureAddress: string;
    destinationAddress: string;
    status: DataStatus;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
  } | null;
}
