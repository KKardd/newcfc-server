"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RequestSubscriber", {
    enumerable: true,
    get: function() {
        return RequestSubscriber;
    }
});
const _typeorm = require("typeorm");
const _requestcontextmiddleware = require("./request-context.middleware");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RequestSubscriber = class RequestSubscriber {
    beforeInsert(event) {
        const request = this.getRequestFromContext();
        if (request != null && request.user != undefined) {
            event.entity.createdBy = request.user.payload.userId;
            event.entity.updatedBy = request.user.payload.userId;
        } else {
            event.entity.createdBy = 0;
            event.entity.updatedBy = 0;
        }
    }
    beforeUpdate(event) {
        const request = this.getRequestFromContext();
        if (event.entity) {
            if (request != null && request.user != undefined) {
                event.entity.updatedBy = request.user.payload.userId;
            } else {
                event.entity.createdBy = 0;
                event.entity.updatedBy = 0;
            }
            event.entity.updatedAt = new Date();
        }
    }
    getRequestFromContext() {
        const request = _requestcontextmiddleware.RequestContext.getRequest();
        if (!request) {
            return null;
        }
        return request;
    }
    constructor(entityManager){
        this.entityManager = entityManager;
    }
};
RequestSubscriber = _ts_decorate([
    (0, _typeorm.EventSubscriber)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.EntityManager === "undefined" ? Object : _typeorm.EntityManager
    ])
], RequestSubscriber);

//# sourceMappingURL=request.subscriber.js.map