"use strict";
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
    Pagination: function() {
        return Pagination;
    },
    PaginationQuery: function() {
        return PaginationQuery;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
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
let PaginationQuery = class PaginationQuery {
    get skip() {
        if (this.countPerPage === undefined) {
            return 0;
        }
        return (this.page - 1) * this.countPerPage;
    }
    constructor(){
        this.page = 1;
        this.countPerPage = 20;
    }
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: Number,
        default: 1,
        description: 'Page number'
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], PaginationQuery.prototype, "page", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        type: Number,
        default: 20,
        description: 'Number of items per page'
    }),
    (0, _classtransformer.Transform)(({ value })=>{
        const number = parseInt(value, 10);
        return number === -1 ? undefined : number;
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Max)(100),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], PaginationQuery.prototype, "countPerPage", void 0);
let Pagination = class Pagination {
    constructor({ paginationQuery, totalCount }){
        this.page = paginationQuery.page;
        this.countPerPage = paginationQuery.countPerPage === undefined ? -1 : paginationQuery.countPerPage;
        this.totalCount = totalCount;
        if (this.countPerPage === -1) {
            this.pageCount = 1;
            this.hasPrevPage = false;
            this.hasNextPage = false;
        } else {
            this.pageCount = Math.ceil(this.totalCount / this.countPerPage);
            this.hasPrevPage = this.page > 1;
            this.hasNextPage = this.page < this.pageCount;
        }
    }
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Pagination.prototype, "page", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Pagination.prototype, "countPerPage", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Pagination.prototype, "totalCount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Pagination.prototype, "pageCount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], Pagination.prototype, "hasPrevPage", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], Pagination.prototype, "hasNextPage", void 0);

//# sourceMappingURL=pagination.js.map