"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLog", {
    enumerable: true,
    get: function() {
        return ErrorLog;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ErrorLog = class ErrorLog {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], ErrorLog.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 30,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "service", void 0);
_ts_decorate([
    (0, _typeorm.Index)(),
    (0, _typeorm.Column)({
        name: 'request_url',
        type: 'varchar',
        length: 1000,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "requestUrl", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'access_token',
        type: 'varchar',
        length: 1000,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _typeorm.Index)(),
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 10,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "method", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "header", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 1000,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "param", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 1000,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "query", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "body", void 0);
_ts_decorate([
    (0, _typeorm.Index)(),
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 10,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'response_body',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "responseBody", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'stack_trace',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ErrorLog.prototype, "stackTrace", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'elapsed_time',
        type: 'int',
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], ErrorLog.prototype, "elapsedTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'created_at',
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ErrorLog.prototype, "createdAt", void 0);
ErrorLog = _ts_decorate([
    (0, _typeorm.Entity)('error_log')
], ErrorLog);

//# sourceMappingURL=error-log.entity.js.map