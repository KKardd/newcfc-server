"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogController", {
    enumerable: true,
    get: function() {
        return ErrorLogController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _pagination = require("../dto/pagination");
const _searcherrorlog = require("../dto/request/errorlog/search-errorlog");
const _errorlogresponsedto = require("../dto/response/errorlog/errorlog-response.dto");
const _swaggerdecorator = require("../dto/swagger.decorator");
const _errorlogserviceinport = require("../../../port/inbound/error-log-service.in-port");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ErrorLogController = class ErrorLogController {
    async findAll(searchErrorLog, paginationQuery) {
        return this.errorLogService.findAll(searchErrorLog, paginationQuery);
    }
    constructor(errorLogService){
        this.errorLogService = errorLogService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'error log search'
    }),
    (0, _swaggerdecorator.ApiSuccessResponse)(200, _errorlogresponsedto.ErrorLogResponseDto, {
        paginated: true
    }),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _searcherrorlog.SearchErrorLog === "undefined" ? Object : _searcherrorlog.SearchErrorLog,
        typeof _pagination.PaginationQuery === "undefined" ? Object : _pagination.PaginationQuery
    ]),
    _ts_metadata("design:returntype", Promise)
], ErrorLogController.prototype, "findAll", null);
ErrorLogController = _ts_decorate([
    (0, _swagger.ApiTags)('ErrorLog'),
    (0, _common.Controller)('/error-logs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _errorlogserviceinport.ErrorLogServiceInPort === "undefined" ? Object : _errorlogserviceinport.ErrorLogServiceInPort
    ])
], ErrorLogController);

//# sourceMappingURL=errorlog.controller.js.map