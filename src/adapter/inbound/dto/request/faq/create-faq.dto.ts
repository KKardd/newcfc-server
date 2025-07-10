import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ description: 'FAQ 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'FAQ 내용' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
