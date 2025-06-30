import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { RefreshTokenService } from '@/infrastructure/refresh-token.service';
import { TokenProvider } from '@/security/jwt/token.provider';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    const accessToken = /^Bearer (.*)$/.exec(authorization)?.[1];

    if (!accessToken) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    try {
      const decoded = await this.tokenProvider.verifyAccessToken(accessToken);
      request.user = decoded;
      const userId = request.user.payload.userId.toString();

      try {
        const refreshToken = await this.refreshTokenService.getToken(userId);

        if (!refreshToken) {
          throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        await this.tokenProvider.verifyRefreshToken(refreshToken);
      } catch (error) {
        throw new CustomException(ErrorCode.INVALID_TOKEN, error as string);
      }

      return true;
    } catch (error) {
      throw new CustomException(ErrorCode.INVALID_TOKEN, error as string);
    }
  }
}
