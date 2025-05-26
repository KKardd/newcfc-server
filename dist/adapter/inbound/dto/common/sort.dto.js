/* eslint-disable @typescript-eslint/no-explicit-any */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SortDirection: function() {
        return SortDirection;
    },
    SortQuery: function() {
        return SortQuery;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var SortDirection = /*#__PURE__*/ function(SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
    return SortDirection;
}({});
let SortQuery = class SortQuery {
    constructor(){
        this.sortDirection = "ASC";
    }
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        title: '정렬 기준',
        enum: []
    }),
    _ts_metadata("design:type", Object)
], SortQuery.prototype, "sortBy", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        title: '정렬 순서',
        enum: SortDirection,
        default: "ASC"
    }),
    (0, _classvalidator.IsEnum)(SortDirection),
    _ts_metadata("design:type", String)
], SortQuery.prototype, "sortDirection", void 0);

//# sourceMappingURL=sort.dto.js.map