import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable, map } from 'rxjs';
import { Pagination } from './pagination';
import { NO_GLOBAL_INTERCEPTOR } from '@/config/no-global-interceptor.decorator';

export type Response<T> = {
  data: T;
  pagination?: Pagination;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly reflector = new Reflector();

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    const noGlobalInterceptor = this.reflector.getAllAndOverride<boolean>(NO_GLOBAL_INTERCEPTOR, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noGlobalInterceptor) {
      return next.handle() as any;
    }

    return next.handle().pipe(
      map((data) => {
        const response = data as any;

        if (response?.pagination) {
          return data as Response<T>;
        }
        return { data };
      }),
    );
  }
}
