import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ description: 'FAQ 제목', example: '사이트 이용 문의' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'FAQ 내용',
    example: '사이트 이용에 대한 상세 안내입니다.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
