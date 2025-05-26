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
    TokenPayload: function() {
        return TokenPayload;
    },
    UserAccessTokenPayload: function() {
        return UserAccessTokenPayload;
    },
    UserRefreshTokenPayload: function() {
        return UserRefreshTokenPayload;
    }
});
const _classvalidator = require("class-validator");
const _userroleenum = require("../../domain/enum/user-role.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TokenPayload = class TokenPayload {
};
let UserAccessTokenPayload = class UserAccessTokenPayload {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UserAccessTokenPayload.prototype, "tenantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UserAccessTokenPayload.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_userroleenum.UserRoleType, {
        each: true
    }),
    _ts_metadata("design:type", Array)
], UserAccessTokenPayload.prototype, "roles", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], UserAccessTokenPayload.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UserAccessTokenPayload.prototype, "name", void 0);
let UserRefreshTokenPayload = class UserRefreshTokenPayload {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UserRefreshTokenPayload.prototype, "tenantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UserRefreshTokenPayload.prototype, "userId", void 0);

//# sourceMappingURL=token.payload.js.map