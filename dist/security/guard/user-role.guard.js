"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRolesGuard", {
    enumerable: true,
    get: function() {
        return UserRolesGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _customexception = require("../../exception/custom.exception");
const _errorcodeenum = require("../../exception/error-code.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserRolesGuard = class UserRolesGuard {
    canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (!requiredRoles) {
            throw new _customexception.CustomException(_errorcodeenum.ErrorCode.INVALID_TOKEN);
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const hasRole = requiredRoles.some((role)=>user.payload.roles.some((TenantUserRole)=>TenantUserRole === role));
        if (!hasRole) {
            throw new _customexception.CustomException(_errorcodeenum.ErrorCode.FORBIDDEN_ROLE);
        }
        return true;
    }
    constructor(reflector){
        this.reflector = reflector;
    }
};
UserRolesGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], UserRolesGuard);

//# sourceMappingURL=user-role.guard.js.map