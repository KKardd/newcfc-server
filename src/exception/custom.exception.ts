import { HttpException } from '@nestjs/common';

import { ErrorCode, HttpStatusMap } from '@/exception/error-code.enum';

export class CustomException extends HttpException {
  private readonly errorCode: ErrorCode;
  private readonly customMessage: string;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message || errorCode, HttpStatusMap[errorCode]);
    this.errorCode = errorCode;
    this.customMessage = message || '';
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }

  getCustomMessage(): string {
    return this.customMessage;
  }
}
