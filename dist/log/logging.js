"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "logging", {
    enumerable: true,
    get: function() {
        return logging;
    }
});
const _nestwinston = require("nest-winston");
const _winston = /*#__PURE__*/ _interop_require_wildcard(require("winston"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};
_winston.addColors(colors);
function logging() {
    const nodeEnv = process.env.NODE_ENV || 'local';
    const format = [
        'development',
        'test'
    ].includes(nodeEnv) ? _winston.format.combine(_winston.format.colorize({
        all: true
    }), _winston.format.timestamp(), _winston.format.ms(), _winston.format.printf(({ timestamp, level, message })=>{
        return `${timestamp} ${level}: ${message}`;
    })) : _winston.format.combine(_winston.format.timestamp(), _winston.format.ms(), _winston.format.json());
    return _nestwinston.WinstonModule.createLogger({
        transports: [
            new _winston.transports.Console({
                format
            })
        ]
    });
}

//# sourceMappingURL=logging.js.map