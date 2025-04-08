import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { logging } from '@/log/logging';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = logging();

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    this.logger.log(`Request: ${method} ${originalUrl} - ${userAgent} ${ip}`);

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(`Response close: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });

    next();
  }
}
