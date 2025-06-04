import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
