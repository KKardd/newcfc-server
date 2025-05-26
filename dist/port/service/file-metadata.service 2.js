"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return FileMetadataService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _clients3 = require("@aws-sdk/client-s3");
const _fileuploadtypeenum = require("../../domain/enum/file-upload-type.enum");
const _customexception = require("../../exception/custom.exception");
const _errorcodeenum = require("../../exception/error-code.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let FileMetadataService = class FileMetadataService {
    async upload(uploadType, serialId, file) {
        const decodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        let filePath = '';
        switch(uploadType){
            case _fileuploadtypeenum.FileUploadType.CUSTOM_EMISSION_FACTOR_REFERENCE:
                if (file.size >= 31457280) {
                    throw new _customexception.CustomException(_errorcodeenum.ErrorCode.FILE_SIZE_EXCEEDED);
                }
                filePath += `custom-emission-factor/id-${serialId}`;
                break;
        }
        let putObjectCommandOutput = null;
        try {
            const key = `${filePath}/${decodedFileName}`;
            const command = new _clients3.PutObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            });
            putObjectCommandOutput = await this.s3Client.send(command);
            return {
                url: key,
                mimeType: file.mimetype,
                fileSize: file.size
            };
        } catch (error) {
            if (error instanceof _clients3.S3ServiceException) {
                throw error;
            }
            if (putObjectCommandOutput?.ETag) {
                const deleteCommand = new _clients3.DeleteObjectsCommand({
                    Bucket: this.BUCKET_NAME,
                    Delete: {
                        Objects: [
                            {
                                Key: filePath
                            }
                        ]
                    }
                });
                await this.s3Client.send(deleteCommand);
            }
            throw error;
        }
    }
    constructor(configService, s3Client){
        this.configService = configService;
        this.s3Client = s3Client;
        this.BUCKET_NAME = this.configService.get('AWS_S3_BUCKETS_NAME');
    }
};
FileMetadataService = _ts_decorate([
    _ts_param(1, (0, _common.Inject)('S3_CLIENT')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _clients3.S3Client === "undefined" ? Object : _clients3.S3Client
    ])
], FileMetadataService);

//# sourceMappingURL=file-metadata.service 2.js.map