"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "S3Provider", {
    enumerable: true,
    get: function() {
        return S3Provider;
    }
});
const _config = require("@nestjs/config");
const _clients3 = require("@aws-sdk/client-s3");
const S3Provider = [
    {
        provide: 'S3_CLIENT',
        import: [
            _config.ConfigModule
        ],
        inject: [
            _config.ConfigService
        ],
        useFactory: (configService)=>{
            return new _clients3.S3Client({
                region: configService.get('AWS_S3_REGION'),
                credentials: {
                    accessKeyId: configService.getOrThrow('AWS_S3_ACCESS_KEY'),
                    secretAccessKey: configService.getOrThrow('AWS_S3_SECRET_KEY')
                }
            });
        }
    }
];

//# sourceMappingURL=s3.provider.js.map