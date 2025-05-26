import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '공지사항 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
