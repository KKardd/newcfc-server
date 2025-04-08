import { Injectable, NestMiddleware } from '@nestjs/common';

import { createNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';

const requestNamespace = createNamespace('request');

@Injectable()
export class RequestContext implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    requestNamespace.run(() => {
      requestNamespace.set('request', request);
      next();
    });
  }

  static getRequest() {
    return requestNamespace.get('request');
  }
}
