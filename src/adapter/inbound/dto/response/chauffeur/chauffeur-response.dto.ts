import { Expose } from 'class-transformer';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';
import { ApiProperty } from '@nestjs/swagger';

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

export class ChauffeurResponseDto {
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

  @ApiProperty({ description: '차량 ID' })
  @Expose()
  vehicleId: number | null;

  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @Expose()
  realTimeDispatchId: number | null;

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

  @ApiProperty({ description: '차량 정보', type: VehicleInfoDto, required: false })
  @Expose()
  vehicle?: VehicleInfoDto | null;

  @ApiProperty({ description: '차고지 정보', type: GarageInfoDto, required: false })
  @Expose()
  garage?: GarageInfoDto | null;
}
