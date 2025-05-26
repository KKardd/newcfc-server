"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransformInterceptor", {
    enumerable: true,
    get: function() {
        return TransformInterceptor;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _rxjs = require("rxjs");
const _noglobalinterceptordecorator = require("../../../config/no-global-interceptor.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const noGlobalInterceptor = this.reflector.getAllAndOverride(_noglobalinterceptordecorator.NO_GLOBAL_INTERCEPTOR, [
            context.getHandler(),
            context.getClass()
        ]);
        if (noGlobalInterceptor) {
            return next.handle();
        }
        return next.handle().pipe((0, _rxjs.map)((data)=>{
            const response = data;
            if (response?.pagination) {
                return data;
            }
            return {
                data
            };
        }));
    }
    constructor(){
        this.reflector = new _core.Reflector();
    }
};
TransformInterceptor = _ts_decorate([
    (0, _common.Injectable)()
], TransformInterceptor);

//# sourceMappingURL=transform.interceptor.js.map