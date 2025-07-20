import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

import { NotificationType } from '@/domain/entity/notification.entity';

export class SearchNotificationDto {
  @ApiProperty({ description: '알림 타입', enum: NotificationType, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ description: '읽음 여부', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ description: '생성일 시작', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: '생성일 종료', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}