"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _customexception = require("../../exception/custom.exception");
const _errorcodeenum = require("../../exception/error-code.enum");
const _redisservice = require("../../infrastructure/redis/redis.service");
const _tokenprovider = require("../jwt/token.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];
        if (!authorization) {
            throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN);
        }
        const accessToken = /^Bearer (.*)$/.exec(authorization)?.[1];
        if (!accessToken) {
            throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN);
        }
        try {
            const decoded = await this.tokenProvider.verifyAccessToken(accessToken);
            request.user = decoded;
            const userId = request.user.payload.userId;
            try {
                const refreshToken = await this.redisService.getClient().get(`refresh_${userId}`);
                if (!refreshToken) {
                    throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN);
                }
                await this.tokenProvider.verifyRefreshToken(refreshToken);
            } catch (error) {
                const message = error instanceof Error ? error.message : undefined;
                throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN, message);
            }
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : undefined;
            throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN, message);
        }
    }
    constructor(tokenProvider, redisService){
        this.tokenProvider = tokenProvider;
        this.redisService = redisService;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenprovider.TokenProvider === "undefined" ? Object : _tokenprovider.TokenProvider,
        typeof _redisservice.RedisService === "undefined" ? Object : _redisservice.RedisService
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map