"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogResponseDto", {
    enumerable: true,
    get: function() {
        return ErrorLogResponseDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ErrorLogResponseDto = class ErrorLogResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", Number)
], ErrorLogResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "service", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "requestUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "method", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "header", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "param", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "query", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "body", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "responseBody", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], ErrorLogResponseDto.prototype, "stackTrace", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", Number)
], ErrorLogResponseDto.prototype, "elapsedTime", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ErrorLogResponseDto.prototype, "createdAt", void 0);

//# sourceMappingURL=errorlog-response.dto.js.map