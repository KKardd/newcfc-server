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
    ErrorCode: function() {
        return ErrorCode;
    },
    HttpStatusMap: function() {
        return HttpStatusMap;
    }
});
const _common = require("@nestjs/common");
var ErrorCode = /*#__PURE__*/ function(ErrorCode) {
    /* 400 BAD_REQUEST : 잘못된 요청 */ ErrorCode["INVALID_INPUT_VALUE"] = "INVALID_INPUT_VALUE";
    ErrorCode["INVALID_STATUS"] = "INVALID_STATUS";
    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */ ErrorCode["INVALID_USER"] = "INVALID_USER";
    ErrorCode["INVALID_AUTHENTICATION"] = "INVALID_AUTHENTICATION";
    ErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    /* 403 FORBIDDEN : 인가되지 않은 사용자 */ ErrorCode["INVALID_AUTHORIZATION"] = "INVALID_AUTHORIZATION";
    ErrorCode["FORBIDDEN_ROLE"] = "FORBIDDEN_ROLE";
    ErrorCode["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    ErrorCode["FORBIDDEN_LICENSE"] = "FORBIDDEN_LICENSE";
    /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */ ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["NOT_FOUND_USER"] = "NOT_FOUND_USER";
    ErrorCode["NOT_FOUND_TENANT"] = "NOT_FOUND_TENANT";
    ErrorCode["NOT_FOUND_CONTRACT_LICENSE"] = "NOT_FOUND_CONTRACT_LICENSE";
    ErrorCode["NOT_FOUND_SITE"] = "NOT_FOUND_SITE";
    ErrorCode["NOT_FOUND_INVENTORY"] = "NOT_FOUND_INVENTORY";
    ErrorCode["NOT_FOUND_ACTIVITY"] = "NOT_FOUND_ACTIVITY";
    ErrorCode["NOT_FOUND_ACTIVITY_DATA"] = "NOT_FOUND_ACTIVITY_DATA";
    /* 409 CONFLICT : Resource 의 현재 상태와 충돌. 보통 중복된 데이터 존재 */ /* 410 GONE : 서버는 요청한 리소스가 영구적으로 삭제 */ ErrorCode["EXPIRED_EMAIL_VERIFY_CODE"] = "EXPIRED_EMAIL_VERIFY_CODE";
    /* 413 PAYLOAD_TOO_LARGE : 요청한 파일 크기가 허용된 제한을 초과 */ ErrorCode["FILE_SIZE_EXCEEDED"] = "FILE_SIZE_EXCEEDED";
    /* 500 INTERNAL_SERVER_ERROR */ ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    return ErrorCode;
}({});
const HttpStatusMap = {
    /* 400 BAD_REQUEST : 잘못된 요청 */ ["INVALID_INPUT_VALUE"]: _common.HttpStatus.BAD_REQUEST,
    ["INVALID_STATUS"]: _common.HttpStatus.BAD_REQUEST,
    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */ ["INVALID_USER"]: _common.HttpStatus.UNAUTHORIZED,
    ["INVALID_AUTHENTICATION"]: _common.HttpStatus.UNAUTHORIZED,
    ["INVALID_TOKEN"]: _common.HttpStatus.UNAUTHORIZED,
    /* 403 FORBIDDEN : 인가되지 않은 사용자 */ ["INVALID_AUTHORIZATION"]: _common.HttpStatus.FORBIDDEN,
    ["FORBIDDEN_ROLE"]: _common.HttpStatus.FORBIDDEN,
    ["ACCOUNT_LOCKED"]: _common.HttpStatus.FORBIDDEN,
    ["FORBIDDEN_LICENSE"]: _common.HttpStatus.FORBIDDEN,
    /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */ ["NOT_FOUND"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_USER"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_TENANT"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_CONTRACT_LICENSE"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_SITE"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_INVENTORY"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_ACTIVITY"]: _common.HttpStatus.NOT_FOUND,
    ["NOT_FOUND_ACTIVITY_DATA"]: _common.HttpStatus.NOT_FOUND,
    /* 409 CONFLICT : Resource 의 현재 상태와 충돌. 보통 중복된 데이터 존재 */ /* 410 GONE : 서버는 요청한 리소스가 영구적으로 삭제 */ ["EXPIRED_EMAIL_VERIFY_CODE"]: _common.HttpStatus.GONE,
    /* 413 PAYLOAD_TOO_LARGE : 요청한 파일 크기가 허용된 제한을 초과 */ ["FILE_SIZE_EXCEEDED"]: _common.HttpStatus.PAYLOAD_TOO_LARGE,
    /* 500 INTERNAL_SERVER_ERROR */ ["INTERNAL_SERVER_ERROR"]: _common.HttpStatus.INTERNAL_SERVER_ERROR
};

//# sourceMappingURL=error-code.enum.js.map