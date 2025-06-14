import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class NoticeResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  status: DataStatus;

  @ApiProperty()
  @Expose()
  isPopup: boolean;

  @ApiProperty()
  @Expose()
  popupStartDate: Date | null;

  @ApiProperty()
  @Expose()
  popupEndDate: Date | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
