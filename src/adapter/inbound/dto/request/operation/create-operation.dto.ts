import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested, IsArray, IsEmail } from 'class-validator';

import { OperationType } from '@/domain/enum/operation-type.enum';

export class CreateReservationInfoDto {
  @ApiProperty({ description: '탑승자 이름' })
  @IsString()
  passengerName: string;

  @ApiProperty({ description: '탑승 인원 수' })
  @IsNumber()
  passengerCount: number;

  @ApiProperty({ description: '탑승자 전화번호' })
  @IsString()
  passengerPhone: string;

  @ApiProperty({ description: '탑승자 이메일', required: false })
  @IsOptional()
  @IsEmail()
  passengerEmail?: string;
}

export class CreateWayPointInfoDto {
  @ApiProperty({ description: '날짜 (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ description: '시간 (HH:mm)', required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ description: '경유지 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '주소' })
  @IsString()
  address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @IsOptional()
  @IsString()
  addressDetail?: string;

  @ApiProperty({ description: '위도', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: '경도', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: '순서' })
  @IsNumber()
  order: number;
}

export class CreateScheduleInfoDto {
  @ApiProperty({ description: '실시간 배차 ID', required: false })
  @IsOptional()
  @IsNumber()
  realTimeDispatchId?: number;

  @ApiProperty({ description: '출발지 <-> 도착지 변경 가능', required: false })
  @IsOptional()
  @IsBoolean()
  isReverse?: boolean;

  @ApiProperty({ description: '반복 운행 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isRepeat?: boolean;

  @ApiProperty({ description: '경유지 목록', type: [CreateWayPointInfoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWayPointInfoDto)
  wayPoints?: CreateWayPointInfoDto[];
}

export class CreateManagerInfoDto {
  @ApiProperty({ description: '담당자 이름' })
  @IsString()
  managerName: string;

  @ApiProperty({ description: '담당자 전화번호' })
  @IsString()
  managerNumber: string;
}

export class CreateOperationDto {
  @ApiProperty({ description: '운행 타입', enum: OperationType })
  @IsEnum(OperationType)
  type: OperationType;

  @ApiProperty({
    description: '시작 날짜 및 시간 (예: "2025-01-16T10:00:00", "2025-01-16 10:00", "2025-01-16")',
    required: false,
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({
    description: '종료 날짜 및 시간 (예: "2025-01-16T12:00:00", "2025-01-16 12:00", "2025-01-16")',
    required: false,
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ description: '탑승자 정보', type: CreateReservationInfoDto })
  @ValidateNested()
  @Type(() => CreateReservationInfoDto)
  reservation: CreateReservationInfoDto;

  @ApiProperty({ description: '일정 정보', type: CreateScheduleInfoDto })
  @ValidateNested()
  @Type(() => CreateScheduleInfoDto)
  schedule: CreateScheduleInfoDto;

  @ApiProperty({ description: '담당자 정보 (실시간 배차용)', type: CreateManagerInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateManagerInfoDto)
  manager?: CreateManagerInfoDto;

  @ApiProperty({ description: '기사 ID', required: false })
  @IsOptional()
  @IsNumber()
  chauffeurId?: number;

  @ApiProperty({ description: '차량 ID', required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @ApiProperty({ description: '메모', required: false })
  @IsOptional()
  @IsString()
  memo?: string;
}
