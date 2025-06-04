import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}

export class ChauffeurLoginDto {
  @ApiProperty({ description: '핸드폰 번호' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '생년월일 (YYYYMMDD)' })
  @IsString()
  birthDate: string;
}
