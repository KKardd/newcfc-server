import { ApiProperty } from '@nestjs/swagger';

import { IsJWT } from 'class-validator';

export class RefreshTokenReqBody {
  @ApiProperty({ type: String })
  @IsJWT()
  refreshToken: string;
}

export class RefreshTokenResBody {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
