"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GlobalValidation", {
    enumerable: true,
    get: function() {
        return GlobalValidation;
    }
});
const _common = require("@nestjs/common");
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
let GlobalValidation = class GlobalValidation {
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const model = Object.assign(value);
        for(const property in model){
            if (model[property] == 'null') {
                model[property] = null;
            }
        }
        const newModel = (0, _classtransformer.plainToInstance)(metatype, model, {
            enableImplicitConversion: true
        });
        const errors = await (0, _classvalidator.validate)(newModel, this.options);
        if (errors.length > 0) {
            const messageItems = this.formatErrors(errors);
            throw new _common.BadRequestException(messageItems.join('\r\n'));
        }
        return newModel;
    }
    toValidate(metatype) {
        const types = [
            String,
            Boolean,
            Number,
            Array,
            Object
        ];
        return !types.includes(metatype);
    }
    formatErrors(errors) {
        const result = [];
        errors.forEach((error)=>{
            if (error.constraints) {
                for(const constraintKey in error.constraints){
                    result.push(`${error.property}: ${error.constraints[constraintKey]}`);
                }
            }
            if (error.children && error.children.length > 0) {
                result.push(...this.formatErrors(error.children));
            }
        });
        return result;
    }
    constructor(options){
        this.options = options;
    }
};
GlobalValidation = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _common.ValidationPipeOptions === "undefined" ? Object : _common.ValidationPipeOptions
    ])
], GlobalValidation);

//# sourceMappingURL=global-validation-pipe.js.map