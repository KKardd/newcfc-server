"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpExceptionFilter", {
    enumerable: true,
    get: function() {
        return HttpExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _errorlogentity = require("../domain/entity/error-log.entity");
const _customexception = require("../exception/custom.exception");
const _logging = require("./logging");
const _errorlogserviceoutport = require("../port/outbound/error-log-service.out-port");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let HttpExceptionFilter = class HttpExceptionFilter {
    async catch(exception, host) {
        this.logger.error(`Exception caught: ${exception.message}`);
        const startTime = process.hrtime();
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let accessToken = '';
        let status = 500;
        if (exception instanceof _typeorm.QueryFailedError) {
            status = 500;
        } else {
            status = exception.getStatus ? exception.getStatus() : 500;
        }
        const errorResponse = {
            httpStatus: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message
        };
        if (exception instanceof _customexception.CustomException) {
            errorResponse.errorCode = exception.getErrorCode();
            errorResponse.message = exception.getCustomMessage();
        }
        if (exception instanceof _typeorm.QueryFailedError) {
            errorResponse.message = exception.message;
        }
        const maskedBody = {
            ...request.body
        };
        if (maskedBody.password) {
            maskedBody.password = '**********';
        }
        if (maskedBody.accessToken) {
            maskedBody.accessToken = '**********';
        }
        if (maskedBody.accessToken) {
            maskedBody.refreshToken = '**********';
        }
        const maskedHeaders = {
            ...request.headers
        };
        if (maskedHeaders.authorization) {
            accessToken = maskedHeaders.authorization.replace(/Bearer\s+/i, '');
            maskedHeaders.authorization = maskedHeaders.authorization.replace(/Bearer .+/i, 'Bearer **********');
        }
        this.logger.error(`HttpException : ${request.method} ${request.originalUrl} - ${JSON.stringify(errorResponse)}`);
        const endTime = process.hrtime(startTime);
        const elapsedTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
        const errorLog = new _errorlogentity.ErrorLog();
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
    constructor(errorLogRepository){
        this.errorLogRepository = errorLogRepository;
        this.logger = (0, _logging.logging)();
    }
};
HttpExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_common.HttpException, _common.InternalServerErrorException, _customexception.CustomException, _common.BadRequestException, _common.UnauthorizedException, _common.ForbiddenException, _common.NotFoundException, _typeorm.QueryFailedError),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _errorlogserviceoutport.ErrorLogServiceOutPort === "undefined" ? Object : _errorlogserviceoutport.ErrorLogServiceOutPort
    ])
], HttpExceptionFilter);

//# sourceMappingURL=http-exception-filter.js.map