"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogRepository", {
    enumerable: true,
    get: function() {
        return ErrorLogRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _errorlogentity = require("../../domain/entity/error-log.entity");
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
let ErrorLogRepository = class ErrorLogRepository {
    async save(errorLog) {
        await this.errorLogRepository.save(errorLog);
    }
    async findAll(searchErrorLog, paginationQuery) {
        const queryBuilder = this.errorLogRepository.createQueryBuilder('ErrorLog');
        if (searchErrorLog.requestUrl) {
            queryBuilder.andWhere('ErrorLog.requestUrl = :requestUrl', {
                requestUrl: searchErrorLog.requestUrl
            });
        }
        if (searchErrorLog.method) {
            queryBuilder.andWhere('ErrorLog.method = :method', {
                method: searchErrorLog.method
            });
        }
        if (searchErrorLog.status) {
            queryBuilder.andWhere('ErrorLog.status = :status', {
                status: searchErrorLog.status
            });
        }
        queryBuilder.orderBy('ErrorLog.id', 'DESC').skip(paginationQuery.skip).take(paginationQuery.countPerPage);
        const [errorLogs, totalCount] = await queryBuilder.getManyAndCount();
        return [
            errorLogs,
            totalCount
        ];
    }
    constructor(errorLogRepository){
        this.errorLogRepository = errorLogRepository;
    }
};
ErrorLogRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_errorlogentity.ErrorLog)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ErrorLogRepository);

//# sourceMappingURL=error-log.repository.js.map