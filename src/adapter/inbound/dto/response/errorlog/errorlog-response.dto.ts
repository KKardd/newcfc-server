import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class ErrorLogResponseDto {
  @ApiProperty({ description: '에러 로그 ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '서비스 이름' })
  @Expose()
  service: string;

  @ApiProperty({ description: '요청 URL' })
  @Expose()
  requestUrl: string;

  @ApiProperty({ description: '액세스 토큰' })
  @Expose()
  accessToken: string;

  @ApiProperty({ description: 'HTTP 메소드' })
  @Expose()
  method: string;

  @ApiProperty({ description: '요청 헤더' })
  @Expose()
  header: string;

  @ApiProperty({ description: '요청 파라미터' })
  @Expose()
  param: string;

  @ApiProperty({ description: '요청 쿼리' })
  @Expose()
  query: string;

  @ApiProperty({ description: '요청 바디' })
  @Expose()
  body: string;

  @ApiProperty({ description: '상태' })
  @Expose()
  status: string;

  @ApiProperty({ description: '응답 바디' })
  @Expose()
  responseBody: string;

  @ApiProperty({ description: '스택 트레이스' })
  @Expose()
  stackTrace: string;

  @ApiProperty({ description: '소요 시간(ms)' })
  @Expose()
  elapsedTime: number;

  @ApiProperty({ description: '생성일' })
  @Expose()
  createdAt: Date;
}
