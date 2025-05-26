"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseEntity", {
    enumerable: true,
    get: function() {
        return BaseEntity;
    }
});
const _typeorm = require("typeorm");
const _basetimeentity = require("./basetime.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BaseEntity = class BaseEntity extends _basetimeentity.BaseTimeEntity {
};
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'created_by',
        type: 'integer',
        nullable: false
    }),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", Number)
], BaseEntity.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'updated_by',
        type: 'integer',
        nullable: false
    }),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", Number)
], BaseEntity.prototype, "updatedBy", void 0);

//# sourceMappingURL=base.entity.js.map