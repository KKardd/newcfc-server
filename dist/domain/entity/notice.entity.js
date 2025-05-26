"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Notice", {
    enumerable: true,
    get: function() {
        return Notice;
    }
});
const _typeorm = require("typeorm");
const _baseentity = require("./base.entity");
const _datastatusenum = require("../enum/data-status.enum");
const _noticetargetenum = require("../enum/notice-target.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Notice = class Notice extends _baseentity.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Notice.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 200,
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Notice.prototype, "title", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], Notice.prototype, "content", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'admin_id',
        type: 'integer',
        nullable: false
    }),
    _ts_metadata("design:type", Number)
], Notice.prototype, "adminId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'published_at',
        type: 'timestamp',
        default: ()=>'CURRENT_TIMESTAMP'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Notice.prototype, "publishedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _noticetargetenum.NoticeTarget,
        default: _noticetargetenum.NoticeTarget.ALL
    }),
    _ts_metadata("design:type", typeof _noticetargetenum.NoticeTarget === "undefined" ? Object : _noticetargetenum.NoticeTarget)
], Notice.prototype, "target", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _datastatusenum.DataStatus,
        default: _datastatusenum.DataStatus.REGISTER
    }),
    _ts_metadata("design:type", typeof _datastatusenum.DataStatus === "undefined" ? Object : _datastatusenum.DataStatus)
], Notice.prototype, "status", void 0);
Notice = _ts_decorate([
    (0, _typeorm.Entity)('notice')
], Notice);

//# sourceMappingURL=notice.entity.js.map