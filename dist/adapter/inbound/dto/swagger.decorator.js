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
    ApiFailResponse: function() {
        return ApiFailResponse;
    },
    ApiSuccessResponse: function() {
        return ApiSuccessResponse;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _paginationdto = require("./common/pagination.dto");
const _constants = require("../../../constants");
function isBuiltInType(type) {
    return _constants.BUILT_IN_TYPES.some((item)=>item === type);
}
const ApiSuccessResponse = (status, type, options)=>{
    if (isBuiltInType(type)) {
        return (0, _swagger.ApiResponse)({
            status,
            description: options?.description,
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: options?.isArray ? 'array' : type.name.toLowerCase(),
                        items: options?.isArray ? {
                            type: type.name.toLowerCase()
                        } : undefined
                    }
                }
            },
            example: options?.example
        });
    }
    return (0, _common.applyDecorators)((0, _swagger.ApiExtraModels)(type), (0, _swagger.ApiResponse)({
        status,
        description: options?.description,
        schema: options?.paginated ? {
            allOf: [
                {
                    $ref: (0, _swagger.getSchemaPath)(_paginationdto.PaginationResponse)
                },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: (0, _swagger.getSchemaPath)(type)
                            }
                        }
                    }
                }
            ]
        } : {
            properties: {
                data: options?.isArray ? {
                    type: 'array',
                    items: {
                        $ref: (0, _swagger.getSchemaPath)(type)
                    }
                } : {
                    $ref: (0, _swagger.getSchemaPath)(type)
                }
            }
        },
        example: options?.example
    }));
};
const ApiFailResponse = (status, errors)=>{
    return (0, _common.applyDecorators)((0, _swagger.ApiResponse)({
        status,
        content: {
            'application/json': {
                examples: errors.reduce((acc, { example, response })=>{
                    acc[example] = {
                        value: {
                            timestamp: new Date().toISOString(),
                            path: '/path',
                            httpStatus: status,
                            ...response
                        }
                    };
                    return acc;
                }, {})
            }
        }
    }));
};

//# sourceMappingURL=swagger.decorator.js.map