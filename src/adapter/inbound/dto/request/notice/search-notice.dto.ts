import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchNoticeDto {
  @ApiProperty({ description: '공지사항 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '공지사항 내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '데이터 상태', enum: DataStatus, required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;

  @ApiProperty({ description: '팝업 공지사항 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isPopup?: boolean;
}
