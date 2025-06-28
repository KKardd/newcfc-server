import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { OperationType } from '@/domain/enum/operation-type.enum';

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

  @ApiProperty({ description: '주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;
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
