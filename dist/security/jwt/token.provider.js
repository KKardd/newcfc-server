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
    ISS: function() {
        return ISS;
    },
    SYSTEM_ISS: function() {
        return SYSTEM_ISS;
    },
    TokenProvider: function() {
        return TokenProvider;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _uuid = require("uuid");
const _responsetokendto = require("../../adapter/inbound/dto/response/response-token.dto");
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
const ISS = 'NEWCFC';
const SYSTEM_ISS = 'SYSTEM';
let TokenProvider = class TokenProvider {
    createAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
            algorithm: 'HS512'
        });
    }
    async verifyAccessToken(accessToken) {
        return this.jwtService.verify(accessToken, {
            secret: this.configService.get('JWT_ACCESS_SECRET')
        });
    }
    createRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            algorithm: 'HS512'
        });
    }
    async verifyRefreshToken(refreshToken) {
        return this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });
    }
    createToken(user) {
        const userAccessTokenPayload = {
            iss: ISS,
            sub: user.id.toString(),
            jti: (0, _uuid.v4)(),
            payload: {
                tenantId: 'tenantId' in user ? user.tenantId : 0,
                userId: user.id,
                email: 'email' in user ? user.email : user.phone,
                name: user.name,
                roles: [
                    user.role
                ]
            }
        };
        const userRefreshTokenPayload = {
            iss: ISS,
            sub: user.id.toString(),
            jti: (0, _uuid.v4)(),
            payload: {
                tenantId: 'tenantId' in user ? user.tenantId : 0,
                userId: user.id
            }
        };
        const accessToken = this.createAccessToken(userAccessTokenPayload);
        const refreshToken = this.createRefreshToken(userRefreshTokenPayload);
        const createdResponseTokenDto = new _responsetokendto.ResponseTokenDto();
        createdResponseTokenDto.accessToken = accessToken;
        createdResponseTokenDto.refreshToken = refreshToken;
        return createdResponseTokenDto;
    }
    createSystemAccessToken() {
        const userAccessTokenPayload = {
            iss: SYSTEM_ISS,
            sub: SYSTEM_ISS,
            jti: (0, _uuid.v4)(),
            payload: {
                tenantId: 0,
                userId: 0,
                email: SYSTEM_ISS,
                name: SYSTEM_ISS,
                roles: [
                    _userroleenum.UserRoleType.SUPER_ADMIN
                ]
            }
        };
        return this.createAccessToken(userAccessTokenPayload);
    }
    constructor(jwtService, configService){
        this.jwtService = jwtService;
        this.configService = configService;
    }
};
TokenProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], TokenProvider);

//# sourceMappingURL=token.provider.js.map