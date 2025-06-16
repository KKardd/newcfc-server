import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDispatchPointDto {
  @ApiProperty({ description: '배차 지점 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '배차 지점 주소' })
  @IsNotEmpty()
  @IsString()
  address: string;
}
