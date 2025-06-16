import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ description: '에러 발생 시간' })
  timestamp: string;

  @ApiProperty({ description: '요청 경로' })
  path: string;

  @ApiProperty({ description: 'HTTP 메소드' })
  method: string;

  @ApiProperty({ description: 'HTTP 상태 코드' })
  httpStatus: number;

  @ApiProperty({ description: '에러 메시지' })
  message: string;

  @ApiProperty({ description: '에러 코드', required: false })
  errorCode?: string;
}
