import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto {
  @ApiProperty({ description: 'FAQ 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'FAQ 내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}
