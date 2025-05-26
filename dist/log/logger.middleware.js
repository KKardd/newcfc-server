"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggerMiddleware", {
    enumerable: true,
    get: function() {
        return LoggerMiddleware;
    }
});
const _common = require("@nestjs/common");
const _logging = require("./logging");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LoggerMiddleware = class LoggerMiddleware {
    use(request, response, next) {
        const { method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
        const ip = request.ip;
        this.logger.log(`Request: ${method} ${originalUrl} - ${userAgent} ${ip}`);
        response.on('close', ()=>{
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            this.logger.log(`Response close: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });
        next();
    }
    constructor(){
        this.logger = (0, _logging.logging)();
    }
};
LoggerMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], LoggerMiddleware);

//# sourceMappingURL=logger.middleware.js.map