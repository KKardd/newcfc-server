"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogService", {
    enumerable: true,
    get: function() {
        return ErrorLogService;
    }
});
const _common = require("@nestjs/common");
const _classtransformer = require("class-transformer");
const _paginationdto = require("../../adapter/inbound/dto/common/pagination.dto");
const _pagination = require("../../adapter/inbound/dto/pagination");
const _errorlogresponsedto = require("../../adapter/inbound/dto/response/errorlog/errorlog-response.dto");
const _errorlogserviceoutport = require("../outbound/error-log-service.out-port");
const _serialization = require("../../validate/serialization");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ErrorLogService = class ErrorLogService {
    async save(errorLog) {
        await this.errorLogServiceOutPort.save(errorLog);
    }
    async findAll(searchErrorLog, paginationQuery) {
        const [errorLogs, totalCount] = await this.errorLogServiceOutPort.findAll(searchErrorLog, paginationQuery);
        const pagination = new _pagination.Pagination({
            totalCount,
            paginationQuery
        });
        const errorlogs = (0, _classtransformer.plainToInstance)(_errorlogresponsedto.ErrorLogResponseDto, errorLogs, _serialization.classTransformDefaultOptions);
        return new _paginationdto.PaginationResponse(errorlogs, pagination);
    }
    constructor(errorLogServiceOutPort){
        this.errorLogServiceOutPort = errorLogServiceOutPort;
    }
};
ErrorLogService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _errorlogserviceoutport.ErrorLogServiceOutPort === "undefined" ? Object : _errorlogserviceoutport.ErrorLogServiceOutPort
    ])
], ErrorLogService);

//# sourceMappingURL=error-log.service.js.map