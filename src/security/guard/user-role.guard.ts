import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { UserRoleType } from '@/domain/enum/user-role.enum';
import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRoleType>('role', context.getHandler());

    if (!requiredRole) {
      return true; // 역할 요구사항이 없으면 통과
    }

    const request: Request & { user: { payload: UserAccessTokenPayload } } = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.payload) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    const userRoles = user.payload.roles;

    // Admin 역할은 모든 권한을 가짐
    if (userRoles.includes(UserRoleType.SUPER_ADMIN) || userRoles.includes(UserRoleType.SUB_ADMIN)) {
      return true;
    }

    // 요구된 역할과 사용자 역할이 일치하는지 확인
    if (userRoles.includes(requiredRole)) {
      return true;
    }

    throw new CustomException(ErrorCode.FORBIDDEN_ROLE);
  }
}
