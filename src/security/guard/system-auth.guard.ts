import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { TokenProvider } from '@/security/jwt/token.provider';

export const SYSTEM_ISS = 'SYSTEM';

@Injectable()
export class SystemAuthGuard implements CanActivate {
  constructor(private readonly tokenProvider: TokenProvider) {}

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
      const iss = request.user.iss;

      if (iss !== SYSTEM_ISS) {
        throw new CustomException(ErrorCode.INVALID_TOKEN);
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      throw new CustomException(ErrorCode.INVALID_TOKEN, message);
    }
  }
}
