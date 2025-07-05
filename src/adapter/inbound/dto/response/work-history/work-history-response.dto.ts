import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class WorkHistoryChauffeurDto {
  @ApiProperty({ description: '기사 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '기사 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '핸드폰 번호' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '기사 타입', enum: ChauffeurType })
  @Expose()
  type: ChauffeurType;
}

export class WorkHistoryVehicleDto {
  @ApiProperty({ description: '차량 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차량 번호' })
  @Expose()
  vehicleNumber: string;

  @ApiProperty({ description: '차량 모델명' })
  @Expose()
  modelName: string;

  @ApiProperty({ description: '차량 상태', enum: VehicleStatus })
  @Expose()
  vehicleStatus: VehicleStatus;
}

export class WorkHistoryResponseDto {
  @ApiProperty({ description: '근무 내역 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '기사 ID' })
  @Expose()
  chauffeurId: number;

  @ApiProperty({ description: '기사 이름' })
  @Expose()
  chauffeurName: string;

  @ApiProperty({ description: '기사 전화번호' })
  @Expose()
  chauffeurPhone: string;

  @ApiProperty({ description: '차량 ID', required: false })
  @Expose()
  vehicleId: number | null;

  @ApiProperty({ description: '차량 번호', required: false })
  @Expose()
  vehicleNumber: string | null;

  @ApiProperty({ description: '근무 시작 시간' })
  @Expose()
  startTime: Date;

  @ApiProperty({ description: '근무 종료 시간', required: false })
  @Expose()
  endTime: Date | null;

  @ApiProperty({ description: '총 근무 시간(분)', required: false })
  @Expose()
  totalMinutes: number | null;

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

  @ApiProperty({ description: '기사 정보', type: WorkHistoryChauffeurDto, required: false })
  @Expose()
  chauffeur?: WorkHistoryChauffeurDto | null;

  @ApiProperty({ description: '차량 정보', type: WorkHistoryVehicleDto, required: false })
  @Expose()
  vehicle?: WorkHistoryVehicleDto | null;
}
