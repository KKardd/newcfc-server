import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDto {
  @ApiProperty({ description: '공지사항 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '공지사항 내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}
