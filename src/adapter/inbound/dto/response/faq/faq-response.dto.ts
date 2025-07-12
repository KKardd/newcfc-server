import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FaqResponseDto {
  @ApiProperty({ description: 'FAQ ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'FAQ 제목', example: '사이트 이용 문의' })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'FAQ 내용',
    example: '사이트 이용에 대한 상세 안내입니다.',
  })
  @Expose()
  content: string;

  @ApiProperty({ description: '작성자', example: 'admin' })
  @Expose()
  createdBy: string;

  @ApiProperty({ description: '생성일', example: '2023-08-21T15:00:00Z' })
  @Expose()
  createdAt: Date;
}
