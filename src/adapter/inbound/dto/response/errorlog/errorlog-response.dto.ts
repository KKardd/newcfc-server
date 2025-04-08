import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class ErrorLogResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  service: string;

  @ApiProperty()
  @Expose()
  requestUrl: string;

  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  method: string;

  @ApiProperty()
  @Expose()
  header: string;

  @ApiProperty()
  @Expose()
  param: string;

  @ApiProperty()
  @Expose()
  query: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  responseBody: string;

  @ApiProperty()
  @Expose()
  stackTrace: string;

  @ApiProperty()
  @Expose()
  elapsedTime: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
