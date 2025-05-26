"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _bodyparser = require("body-parser");
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _typeormtransactional = require("typeorm-transactional");
const _transforminterceptor = require("./adapter/inbound/dto/transform.interceptor");
const _appmodule = require("./app.module");
const _swaggerconfig = require("./config/swagger.config");
const _constants = require("./constants");
const _httpexceptionfilter = require("./log/http-exception-filter");
const _logging = require("./log/logging");
const _errormodule = require("./module/error.module");
const _errorlogserviceoutport = require("./port/outbound/error-log-service.out-port");
const _globalvalidationpipe = require("./validate/global-validation-pipe");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    (0, _typeormtransactional.initializeTransactionalContext)();
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        logger: (0, _logging.logging)(),
        abortOnError: true
    });
    const logger = new _common.Logger('Bootstrap');
    const configService = app.get(_config.ConfigService);
    const environment = configService.getOrThrow('common.environment');
    const nodeEnv = configService.getOrThrow('common.nodeEnv');
    // Set global prefix
    app.setGlobalPrefix(_constants.GLOBAL_PREFIX);
    app.use((0, _compression.default)());
    // Request Body Size 설정
    app.use((0, _bodyparser.json)({
        limit: '50mb'
    }));
    app.use((0, _bodyparser.urlencoded)({
        limit: '50mb',
        extended: true
    }));
    app.use((0, _helmet.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: true,
        frameguard: {
            action: 'deny'
        },
        xPoweredBy: true,
        xXssProtection: true,
        xContentTypeOptions: true
    }));
    // Enable CORS
    app.enableCors({
        origin: configService.get('common.cors.allowedOrigins')
    });
    (0, _swaggerconfig.setSwagger)(app);
    // Register global pipes, interceptors, filters
    app.useGlobalPipes(new _globalvalidationpipe.GlobalValidation({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.useGlobalInterceptors(new _transforminterceptor.TransformInterceptor());
    const errorLogRepository = app.select(_errormodule.ErrorModule).get(_errorlogserviceoutport.ErrorLogServiceOutPort, {
        strict: true
    });
    app.useGlobalFilters(new _httpexceptionfilter.HttpExceptionFilter(errorLogRepository));
    // Start the application
    const httpPort = configService.getOrThrow('common.httpPort');
    await app.listen(httpPort);
    logger.log(`ENVIRONMENT: ${environment}`);
    logger.log(`NODE_ENV: ${nodeEnv}`);
    logger.log(`Listening on port ${httpPort}`);
}
bootstrap();

//# sourceMappingURL=main.js.map