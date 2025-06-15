import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '공지사항 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: '관리자 ID' })
  @IsNotEmpty()
  @IsNumber()
  adminId: number;

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
