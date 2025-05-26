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
    decimalExponentialRegex: function() {
        return decimalExponentialRegex;
    },
    formatDecimalString: function() {
        return formatDecimalString;
    },
    transferNumberFormat: function() {
        return transferNumberFormat;
    }
});
const transferNumberFormat = (val, options)=>{
    const numberFormat = new Intl.NumberFormat('en', options);
    if (val === null || val === undefined) {
        return val;
    }
    return numberFormat.format(val);
};
const decimalExponentialRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)(E[+-]?\d+)?$/;
const formatDecimalString = (value)=>{
    if (!value.includes('.')) {
        return value;
    }
    const split = value.split('.');
    const integer = split[0];
    let decimal = split[1];
    decimal = decimal.replace(/0+$/, '');
    while(decimal.length < 3){
        decimal += '0';
    }
    return `${integer}.${decimal}`;
};

//# sourceMappingURL=digit.js.map