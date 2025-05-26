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
    TransformBoolStringToBoolean: function() {
        return TransformBoolStringToBoolean;
    },
    TransformEntity: function() {
        return TransformEntity;
    },
    TransformNumberFormat: function() {
        return TransformNumberFormat;
    },
    TransformSortCondition: function() {
        return TransformSortCondition;
    },
    TransformStringToNumber: function() {
        return TransformStringToNumber;
    },
    TransformToDefaultString: function() {
        return TransformToDefaultString;
    }
});
const _classtransformer = require("class-transformer");
const _digit = require("../../../util/digit");
const TransformEntity = (transformFn, options)=>{
    return (0, _classtransformer.Transform)((params)=>{
        return transformFn(params.obj);
    }, {
        ...options,
        toClassOnly: true
    });
};
const TransformBoolStringToBoolean = ()=>{
    return (0, _classtransformer.Transform)(({ value })=>{
        return value.toLowerCase() === 'true';
    });
};
const TransformNumberFormat = (min = 0, max = 10)=>{
    return (0, _classtransformer.Transform)(({ value })=>{
        if (typeof value === 'string') {
            const numberValue = Number(value.replace(/,/g, ''));
            return (0, _digit.transferNumberFormat)(numberValue, {
                minimumFractionDigits: min,
                maximumFractionDigits: max
            });
        } else if (typeof value === 'number') {
            return (0, _digit.transferNumberFormat)(value, {
                minimumFractionDigits: min,
                maximumFractionDigits: max
            });
        } else {
            return value;
        }
    });
};
const TransformToDefaultString = (defaultValue = '')=>{
    return (0, _classtransformer.Transform)(({ value })=>value ?? defaultValue);
};
const TransformStringToNumber = ()=>{
    return (0, _classtransformer.Transform)(({ value })=>{
        if (value == null) {
            return null;
        }
        const number = Number(value);
        if (isNaN(number)) {
            return null;
        }
        return number;
    });
};
const TransformSortCondition = ()=>{
    return (0, _classtransformer.Transform)(({ value })=>{
        return value.split(',').map((sort)=>{
            const [key, order] = sort.split('+');
            return {
                [key]: order
            };
        }).reduce((acc, cur)=>({
                ...acc,
                ...cur
            }), {});
    });
};

//# sourceMappingURL=transform.decorator.js.map