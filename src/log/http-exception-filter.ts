import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { ErrorResponse } from '@/adapter/inbound/dto/response/error-response';
import { ErrorLog } from '@/domain/entity/error-log.entity';
import { CustomException } from '@/exception/custom.exception';
import { logging } from '@/log/logging';
import { ErrorLogServiceOutPort } from '@/port/outbound/error-log-service.out-port';

@Catch(
  HttpException,
  InternalServerErrorException,
  CustomException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  QueryFailedError,
)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = logging();

  constructor(private readonly errorLogRepository: ErrorLogServiceOutPort) {}

  async catch(
    exception:
      | HttpException
      | InternalServerErrorException
      | CustomException
      | BadRequestException
      | UnauthorizedException
      | ForbiddenException
      | NotFoundException
      | QueryFailedError,
    host: ArgumentsHost,
  ) {
    this.logger.error(`Exception caught: ${exception.message}`);

    const startTime = process.hrtime();
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let accessToken: string = '';
    let status = 500;
    if (exception instanceof QueryFailedError) {
      status = 500;
    } else {
      status = exception.getStatus ? exception.getStatus() : 500;
    }

    const errorResponse: ErrorResponse = {
      httpStatus: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    };

    if (exception instanceof CustomException) {
      errorResponse.errorCode = exception.getErrorCode();
      errorResponse.message = exception.getCustomMessage();
    }

    if (exception instanceof QueryFailedError) {
      errorResponse.message = exception.message;
    }

    const maskedBody = { ...request.body };
    if (maskedBody.password) {
      maskedBody.password = '**********';
    }
    if (maskedBody.accessToken) {
      maskedBody.accessToken = '**********';
    }
    if (maskedBody.accessToken) {
      maskedBody.refreshToken = '**********';
    }

    const maskedHeaders = { ...request.headers };
    if (maskedHeaders.authorization) {
      accessToken = maskedHeaders.authorization.replace(/Bearer\s+/i, '');
      maskedHeaders.authorization = maskedHeaders.authorization.replace(/Bearer .+/i, 'Bearer **********');
    }

    this.logger.error(`HttpException : ${request.method} ${request.originalUrl} - ${JSON.stringify(errorResponse)}`);

    const endTime = process.hrtime(startTime);
    const elapsedTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);

    const errorLog = new ErrorLog();
    errorLog.service = 'track';
    errorLog.requestUrl = request.originalUrl;
    errorLog.accessToken = accessToken;
    errorLog.method = request.method;
    errorLog.header = JSON.stringify(maskedHeaders);
    errorLog.param = JSON.stringify(request.params);
    errorLog.query = JSON.stringify(request.query);
    errorLog.body = JSON.stringify(maskedBody);
    errorLog.status = status.toString();
    errorLog.responseBody = JSON.stringify(errorResponse);
    errorLog.stackTrace = exception.stack || '';
    errorLog.elapsedTime = elapsedTime;
    errorLog.createdAt = new Date();

    await this.errorLogRepository.save(errorLog);

    response.status(status).json(errorResponse);
  }
}
