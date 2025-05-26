"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Reservation", {
    enumerable: true,
    get: function() {
        return Reservation;
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
let Reservation = class Reservation extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'operation_id',
        type: 'integer',
        nullable: false,
        unique: true
    }),
    _ts_metadata("design:type", Number)
], Reservation.prototype, "operationId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'passenger_name',
        type: 'varchar',
        length: 100,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Reservation.prototype, "passengerName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'passenger_phone',
        type: 'varchar',
        length: 20,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Reservation.prototype, "passengerPhone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'passenger_email',
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Reservation.prototype, "passengerEmail", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'passenger_count',
        type: 'integer',
        default: 1
    }),
    _ts_metadata("design:type", Number)
], Reservation.prototype, "passengerCount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'safety_phone',
        type: 'varchar',
        length: 20,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Reservation.prototype, "safetyPhone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Reservation.prototype, "memo", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], Reservation.prototype, "status", void 0);
Reservation = _ts_decorate([
    (0, _typeorm.Entity)('reservation')
], Reservation);

//# sourceMappingURL=reservation.entity.js.map