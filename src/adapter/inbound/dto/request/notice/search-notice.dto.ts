import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

import { DataStatus } from '@/domain/enum/data-status.enum';

export class SearchNoticeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(DataStatus)
  status?: DataStatus;

  @ApiProperty({ description: '팝업 공지사항 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isPopup?: boolean;
}
