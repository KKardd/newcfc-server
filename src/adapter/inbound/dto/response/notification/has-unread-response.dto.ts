import { ApiProperty } from '@nestjs/swagger';

export class HasUnreadResponseDto {
  @ApiProperty({
    description: '읽지 않은 알림 존재 여부',
    example: true,
  })
  hasUnread: boolean;
}