"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Chauffeur", {
    enumerable: true,
    get: function() {
        return Chauffeur;
    }
});
const _typeorm = require("typeorm");
const _baseentity = require("./base.entity");
const _datastatusenum = require("../enum/data-status.enum");
const _chauffeurstatusenum = require("../enum/chauffeur-status.enum");
const _chauffeurtypeenum = require("../enum/chauffeur-type.enum");
const _userroleenum = require("../enum/user-role.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Chauffeur = class Chauffeur extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Chauffeur.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 100,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Chauffeur.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 20,
        nullable: false
    }),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], Chauffeur.prototype, "phone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'birth_date',
        type: 'varchar',
        length: 8,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Chauffeur.prototype, "birthDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _chauffeurtypeenum.ChauffeurType
    }),
    _ts_metadata("design:type", typeof _chauffeurtypeenum.ChauffeurType === "undefined" ? Object : _chauffeurtypeenum.ChauffeurType)
], Chauffeur.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'chauffeur_status',
        type: 'enum',
        enum: _chauffeurstatusenum.ChauffeurStatus,
        default: _chauffeurstatusenum.ChauffeurStatus.OFF_DUTY
    }),
    _ts_metadata("design:type", typeof _chauffeurstatusenum.ChauffeurStatus === "undefined" ? Object : _chauffeurstatusenum.ChauffeurStatus)
], Chauffeur.prototype, "chauffeurStatus", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'vehicle_id',
        type: 'integer',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Chauffeur.prototype, "vehicleId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _userroleenum.UserRoleType,
        default: _userroleenum.UserRoleType.CHAUFFEUR
    }),
    _ts_metadata("design:type", typeof _userroleenum.UserRoleType === "undefined" ? Object : _userroleenum.UserRoleType)
], Chauffeur.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], Chauffeur.prototype, "status", void 0);
Chauffeur = _ts_decorate([
    (0, _typeorm.Entity)('chauffeur')
], Chauffeur);

//# sourceMappingURL=chauffeur.entity.js.map