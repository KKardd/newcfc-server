import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class NoticeResponseDto {
  @ApiProperty({ description: '공지사항 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '공지사항 제목' })
  @Expose()
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  @Expose()
  content: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus })
  @Expose()
  status: DataStatus;

  @ApiProperty({ description: '팝업 표시 여부' })
  @Expose()
  isPopup: boolean;

  @ApiProperty({ description: '팝업 시작일', required: false })
  @Expose()
  popupStartDate: Date | null;

  @ApiProperty({ description: '팝업 종료일', required: false })
  @Expose()
  popupEndDate: Date | null;

  @ApiProperty({ description: '작성자명' })
  @Expose()
  createdBy: string;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @Expose()
  updatedAt: Date;
}
