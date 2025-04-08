import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    const request: Request & { user: { payload: UserAccessTokenPayload } } = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = requiredRoles.some((role) => user.payload.roles.some((TenantUserRole) => TenantUserRole === role));

    if (!hasRole) {
      throw new CustomException(ErrorCode.FORBIDDEN_ROLE);
    }

    return true;
  }
}
