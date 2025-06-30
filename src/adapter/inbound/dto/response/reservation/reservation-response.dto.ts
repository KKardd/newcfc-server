import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class ReservationResponseDto {
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

  @ApiProperty({ description: '운행 정보' })
  @Expose()
  operation: {
    id: number;
    type: OperationType;
    isRepeated: boolean;
    startTime: Date | null;
    endTime: Date | null;
    distance: number | null;
    chauffeurId: number | null;
    vehicleId: number | null;
    realTimeDispatchId: number | null;
    additionalCosts: Record<string, number> | null;
    receiptImageUrls: string[] | null;
    status: DataStatus;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
  };

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
