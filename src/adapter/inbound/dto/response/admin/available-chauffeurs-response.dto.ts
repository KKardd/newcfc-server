import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { VehicleStatus } from '@/domain/enum/vehicle-status.enum';

export class AvailableChauffeurVehicleDto {
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
}

export class AvailableChauffeurGarageDto {
  @ApiProperty({ description: '차고지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '차고지 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '차고지 주소' })
  @Expose()
  address: string;
}

export class AvailableChauffeurDto {
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

  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @Expose()
  realTimeDispatchId: number | null;

  @ApiProperty({ description: '사용자 권한', enum: UserRoleType })
  @Expose()
  role: UserRoleType;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus })
  @Expose()
  status: DataStatus;

  @ApiProperty({ description: '배정된 차량 정보', type: AvailableChauffeurVehicleDto, required: false })
  @Expose()
  @Type(() => AvailableChauffeurVehicleDto)
  vehicle?: AvailableChauffeurVehicleDto | null;

  @ApiProperty({ description: '차고지 정보', type: AvailableChauffeurGarageDto, required: false })
  @Expose()
  @Type(() => AvailableChauffeurGarageDto)
  garage?: AvailableChauffeurGarageDto | null;
}

export class UnassignedVehicleDto {
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

  @ApiProperty({ description: '차고지 정보', type: AvailableChauffeurGarageDto })
  @Expose()
  @Type(() => AvailableChauffeurGarageDto)
  garage: AvailableChauffeurGarageDto;
}

export class AvailableChauffeursResponseDto {
  @ApiProperty({
    description: '사용 가능한 기사 목록 (HOSPITAL, EVENT 타입만)',
    type: [AvailableChauffeurDto],
  })
  @Expose()
  @Type(() => AvailableChauffeurDto)
  availableChauffeurs: AvailableChauffeurDto[];

  @ApiProperty({
    description: '미배정 차량 목록',
    type: [UnassignedVehicleDto],
  })
  @Expose()
  @Type(() => UnassignedVehicleDto)
  unassignedVehicles: UnassignedVehicleDto[];
}
