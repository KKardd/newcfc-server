"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Vehicle", {
    enumerable: true,
    get: function() {
        return Vehicle;
    }
});
const _typeorm = require("typeorm");
const _baseentity = require("./base.entity");
const _datastatusenum = require("../enum/data-status.enum");
const _vehiclestatusenum = require("../enum/vehicle-status.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Vehicle = class Vehicle extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'vehicle_number',
        type: 'varchar',
        length: 20,
        nullable: false
    }),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], Vehicle.prototype, "vehicleNumber", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'model_name',
        type: 'varchar',
        length: 100,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Vehicle.prototype, "modelName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'garage_id',
        type: 'integer',
        nullable: false
    }),
    _ts_metadata("design:type", Number)
], Vehicle.prototype, "garageId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'vehicle_status',
        type: 'enum',
        enum: _vehiclestatusenum.VehicleStatus,
        default: _vehiclestatusenum.VehicleStatus.NORMAL
    }),
    _ts_metadata("design:type", typeof _vehiclestatusenum.VehicleStatus === "undefined" ? Object : _vehiclestatusenum.VehicleStatus)
], Vehicle.prototype, "vehicleStatus", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], Vehicle.prototype, "status", void 0);
Vehicle = _ts_decorate([
    (0, _typeorm.Entity)('vehicle')
], Vehicle);

//# sourceMappingURL=vehicle.entity.js.map