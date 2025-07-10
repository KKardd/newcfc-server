import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FaqResponseDto {
  @ApiProperty({ description: 'FAQ ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'FAQ 제목' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'FAQ 내용' })
  @Expose()
  content: string;

  @ApiProperty({ description: '작성자' })
  @Expose()
  createdBy: string;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;
}
