import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AssignChauffeurResponseDto {
  @ApiProperty({ description: '운행 ID' })
  @Expose()
  operationId: number;

  @ApiProperty({ description: '새로 배정된 기사 ID' })
  @Expose()
  newChauffeurId: number;

  @ApiProperty({ description: '새로 배정된 기사 이름' })
  @Expose()
  newChauffeurName: string;

  @ApiProperty({ description: '이전에 배정된 기사 ID (없었다면 null)', required: false })
  @Expose()
  previousChauffeurId: number | null;

  @ApiProperty({ description: '이전에 배정된 기사 이름 (없었다면 null)', required: false })
  @Expose()
  previousChauffeurName: string | null;

  @ApiProperty({ description: '배차 완료 메시지' })
  @Expose()
  message: string;
}
