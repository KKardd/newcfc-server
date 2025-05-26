"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: function() {
        return AppController;
    }
});
const _common = require("@nestjs/common");
const _terminus = require("@nestjs/terminus");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppController = class AppController {
    health() {
        return this.healthCheckService.check([
            ()=>this.typeOrmHealthIndicator.pingCheck('database')
        ]);
    }
    constructor(healthCheckService, typeOrmHealthIndicator){
        this.healthCheckService = healthCheckService;
        this.typeOrmHealthIndicator = typeOrmHealthIndicator;
    }
};
_ts_decorate([
    (0, _common.Get)('/health'),
    (0, _terminus.HealthCheck)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
AppController = _ts_decorate([
    (0, _common.Controller)('/'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _terminus.HealthCheckService === "undefined" ? Object : _terminus.HealthCheckService,
        typeof _terminus.TypeOrmHealthIndicator === "undefined" ? Object : _terminus.TypeOrmHealthIndicator
    ])
], AppController);

//# sourceMappingURL=app.controller.js.map