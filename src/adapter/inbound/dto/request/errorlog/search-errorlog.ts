import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, Length } from 'class-validator';

export class SearchErrorLog {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(3, 1000)
  requestUrl: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(3, 10)
  method: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(3)
  status: string;
}
