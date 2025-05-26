"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _terminus = require("@nestjs/terminus");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _typeormtransactional = require("typeorm-transactional");
const _appcontroller = require("./app.controller");
const _commonconfig = /*#__PURE__*/ _interop_require_default(require("./config/common.config"));
const _typeormconfig = require("./config/typeorm.config");
const _loggermiddleware = require("./log/logger.middleware");
const _errormodule = require("./module/error.module");
const _filemodule = require("./module/file.module");
const _awsmodule = require("./module/infrastructure/aws.module");
const _tokenprovidermodule = require("./module/token-provider.module");
const _requestcontextmiddleware = require("./port/audit/request-context.middleware");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const typeOrmModules = [
    _typeorm.TypeOrmModule.forRootAsync({
        imports: [
            _config.ConfigModule
        ],
        useFactory: async (configService)=>(0, _typeormconfig.TypeOrmConfig)(configService),
        dataSourceFactory: async (options)=>{
            if (!options) {
                throw new Error('Invalid options passed');
            }
            return (0, _typeormtransactional.addTransactionalDataSource)(new _typeorm1.DataSource(options));
        },
        inject: [
            _config.ConfigService
        ]
    })
];
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(_loggermiddleware.LoggerMiddleware).forRoutes('*').apply(_requestcontextmiddleware.RequestContext).forRoutes({
            path: '*',
            method: _common.RequestMethod.ALL
        });
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
                load: [
                    _commonconfig.default
                ]
            }),
            ...typeOrmModules,
            _awsmodule.AwsModule,
            _filemodule.FileModule,
            _terminus.TerminusModule,
            // RedisModule,
            _tokenprovidermodule.TokenProviderModule,
            _errormodule.ErrorModule
        ],
        controllers: [
            _appcontroller.AppController
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map