import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto {
  @ApiProperty({
    description: 'FAQ 제목',
    required: false,
    example: '결제 관련 문의',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'FAQ 내용',
    required: false,
    example: '결제 관련 상세 안내입니다.',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
