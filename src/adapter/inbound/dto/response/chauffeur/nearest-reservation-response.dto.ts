import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { OperationType } from '@/domain/enum/operation-type.enum';

export class NextWayPointDto {
  @ApiProperty({ description: '경유지 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '경유지 이름', required: false })
  @Expose()
  name: string | null;

  @ApiProperty({ description: '주소' })
  @Expose()
  address: string;

  @ApiProperty({ description: '상세 주소' })
  @Expose()
  addressDetail: string | null;

  @ApiProperty({ description: '위도' })
  @Expose()
  latitude: number | null;

  @ApiProperty({ description: '경도' })
  @Expose()
  longitude: number | null;

  @ApiProperty({ description: '방문 시간', required: false })
  @Expose()
  visitTime: Date | null;

  @ApiProperty({ description: '순서' })
  @Expose()
  order: number;
}

export class NextReservationDto {
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

  @ApiProperty({ description: '승객 수' })
  @Expose()
  passengerCount: number;

  @ApiProperty({ description: '메모' })
  @Expose()
  memo: string | null;
}

export class NextOperationDto {
  @ApiProperty({ description: '운행 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '운행 타입', enum: OperationType })
  @Expose()
  type: OperationType;

  @ApiProperty({ description: '시작 예정 시간' })
  @Expose()
  startTime: Date | null;

  @ApiProperty({ description: '종료 예정 시간' })
  @Expose()
  endTime: Date | null;

  @ApiProperty({ description: '현재 시간으로부터 시작까지 남은 분' })
  @Expose()
  minutesUntilStart: number | null;
}

export class NearestReservationResponseDto {
  @ApiProperty({ description: '다음 운행 정보', type: NextOperationDto })
  @Expose()
  @Type(() => NextOperationDto)
  operation: NextOperationDto;

  @ApiProperty({ description: '다음 예약 정보', type: NextReservationDto, required: false })
  @Expose()
  @Type(() => NextReservationDto)
  reservation: NextReservationDto | null;

  @ApiProperty({ description: '경유지 목록', type: [NextWayPointDto] })
  @Expose()
  @Type(() => NextWayPointDto)
  wayPoints: NextWayPointDto[];

  @ApiProperty({ description: '실시간 배차 출발지 주소', required: false })
  @Expose()
  departureAddress: string | null;

  @ApiProperty({ description: '실시간 배차 목적지 주소', required: false })
  @Expose()
  destinationAddress: string | null;
}
