"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Operation", {
    enumerable: true,
    get: function() {
        return Operation;
    }
});
const _typeorm = require("typeorm");
const _baseentity = require("./base.entity");
const _datastatusenum = require("../enum/data-status.enum");
const _operationtypeenum = require("../enum/operation-type.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Operation = class Operation extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Operation.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _operationtypeenum.OperationType
    }),
    _ts_metadata("design:type", typeof _operationtypeenum.OperationType === "undefined" ? Object : _operationtypeenum.OperationType)
], Operation.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_repeated',
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Operation.prototype, "isRepeated", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'start_time',
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "startTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'end_time',
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "endTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'distance',
        type: 'float',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "distance", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'chauffeur_id',
        type: 'integer',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "chauffeurId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'vehicle_id',
        type: 'integer',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "vehicleId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'real_time_dispatch_id',
        type: 'integer',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "realTimeDispatchId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'additional_costs',
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "additionalCosts", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'receipt_image_url',
        type: 'varchar',
        length: 255,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Operation.prototype, "receiptImageUrl", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], Operation.prototype, "status", void 0);
Operation = _ts_decorate([
    (0, _typeorm.Entity)('operation')
], Operation);

//# sourceMappingURL=operation.entity.js.map