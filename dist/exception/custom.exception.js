"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomException", {
    enumerable: true,
    get: function() {
        return CustomException;
    }
});
const _common = require("@nestjs/common");
const _errorcodeenum = require("./error-code.enum");
let CustomException = class CustomException extends _common.HttpException {
    getErrorCode() {
        return this.errorCode;
    }
    getCustomMessage() {
        return this.customMessage;
    }
    constructor(errorCode, message){
        super(message || errorCode, _errorcodeenum.HttpStatusMap[errorCode]);
        this.errorCode = errorCode;
        this.customMessage = message || '';
    }
};

//# sourceMappingURL=custom.exception.js.map