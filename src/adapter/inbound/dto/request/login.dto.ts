import { ApiProperty } from '@nestjs/swagger';

import { IsString, Matches } from 'class-validator';

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

  @ApiProperty({ description: '생년월일 (YYMMDD)' })
  @IsString()
  @Matches(/^\d{6}$/, { message: '생년월일은 6자리 숫자여야 합니다 (YYMMDD)' })
  birthDate: string;
}
