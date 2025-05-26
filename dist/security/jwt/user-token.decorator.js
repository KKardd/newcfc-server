"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserToken", {
    enumerable: true,
    get: function() {
        return UserToken;
    }
});
const _common = require("@nestjs/common");
const UserToken = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        throw new Error('JwtAuthGuard must be used before UserToken');
    }
    return request.user.payload;
});

//# sourceMappingURL=user-token.decorator.js.map