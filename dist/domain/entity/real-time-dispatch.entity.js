"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RealTimeDispatch", {
    enumerable: true,
    get: function() {
        return RealTimeDispatch;
    }
});
const _typeorm = require("typeorm");
const _baseentity = require("./base.entity");
const _datastatusenum = require("../enum/data-status.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RealTimeDispatch = class RealTimeDispatch extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], RealTimeDispatch.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 100,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], RealTimeDispatch.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], RealTimeDispatch.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'departure_address',
        type: 'varchar',
        length: 255,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], RealTimeDispatch.prototype, "departureAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'destination_address',
        type: 'varchar',
        length: 255,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], RealTimeDispatch.prototype, "destinationAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], RealTimeDispatch.prototype, "status", void 0);
RealTimeDispatch = _ts_decorate([
    (0, _typeorm.Entity)('real_time_dispatch')
], RealTimeDispatch);

//# sourceMappingURL=real-time-dispatch.entity.js.map