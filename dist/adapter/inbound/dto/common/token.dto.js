"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RefreshTokenReqBody: function() {
        return RefreshTokenReqBody;
    },
    RefreshTokenResBody: function() {
        return RefreshTokenResBody;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RefreshTokenReqBody = class RefreshTokenReqBody {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: String
    }),
    (0, _classvalidator.IsJWT)(),
    _ts_metadata("design:type", String)
], RefreshTokenReqBody.prototype, "refreshToken", void 0);
let RefreshTokenResBody = class RefreshTokenResBody {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: String
    }),
    _ts_metadata("design:type", String)
], RefreshTokenResBody.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: String
    }),
    _ts_metadata("design:type", String)
], RefreshTokenResBody.prototype, "refreshToken", void 0);

//# sourceMappingURL=token.dto.js.map