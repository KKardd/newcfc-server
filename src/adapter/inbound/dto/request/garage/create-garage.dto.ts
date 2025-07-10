import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGarageDto {
  @ApiProperty({ description: '차고지 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '차고지 주소' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: '차고지 상세 주소', required: false })
  @IsOptional()
  @IsString()
  detailAddress?: string;
}
