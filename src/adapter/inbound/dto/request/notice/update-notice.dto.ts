import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class UpdateNoticeDto {
  @ApiProperty({ description: '공지사항 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '공지사항 내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '팝업 공지사항 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isPopup?: boolean;

  @ApiProperty({ description: '팝업 시작일', required: false })
  @IsOptional()
  @IsDateString()
  popupStartDate?: string;

  @ApiProperty({ description: '팝업 종료일', required: false })
  @IsOptional()
  @IsDateString()
  popupEndDate?: string;
}
