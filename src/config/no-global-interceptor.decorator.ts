import { SetMetadata } from '@nestjs/common';

export const NO_GLOBAL_INTERCEPTOR = 'NO_GLOBAL_INTERCEPTOR';
export const NoGlobalInterceptor = () => SetMetadata(NO_GLOBAL_INTERCEPTOR, true);
