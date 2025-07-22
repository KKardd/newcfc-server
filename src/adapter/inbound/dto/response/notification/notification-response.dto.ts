import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { NotificationType } from '@/domain/entity/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ description: '알림 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '사용자 ID' })
  @Expose()
  userId: number;

  @ApiProperty({ description: '사용자 타입' })
  @Expose()
  userType: string;

  @ApiProperty({ description: '알림 제목' })
  @Expose()
  title: string;

  @ApiProperty({ description: '알림 내용' })
  @Expose()
  body: string;

  @ApiProperty({ description: '알림 타입', enum: NotificationType })
  @Expose()
  type: NotificationType;

  @ApiProperty({ description: '추가 데이터', type: Object })
  @Expose()
  data: Record<string, any>;

  @ApiProperty({ description: '읽음 여부' })
  @Expose()
  isRead: boolean;

  @ApiProperty({ description: '읽은 시간' })
  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  readAt: string;

  @ApiProperty({ description: '생성 시간' })
  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  createdAt: string;

  @ApiProperty({ description: '수정 시간' })
  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  updatedAt: string;

  @ApiProperty({ description: '수정자 ID' })
  @Expose()
  updatedBy: number;
}