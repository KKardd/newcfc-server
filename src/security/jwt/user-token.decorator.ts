import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new Error('JwtAuthGuard must be used before UserToken');
  }

  return request.user.payload;
});
