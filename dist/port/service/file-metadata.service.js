"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileMetadataService", {
    enumerable: true,
    get: function() {
        return FileMetadataService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _clients3 = require("@aws-sdk/client-s3");
const _uuid = require("uuid");
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
    async upload(uploadType, serialNumber, file) {
        const bucketName = this.configService.get('AWS_S3_BUCKETS_NAME');
        const fileKey = `${uploadType}/${serialNumber}/${(0, _uuid.v4)()}-${file.originalname}`;
        await this.s3Client.send(new _clients3.PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype
        }));
        return {
            url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`,
            mimeType: file.mimetype,
            fileSize: file.size
        };
    }
    async getFileUrl(filePath) {
        const bucketName = this.configService.get('AWS_S3_BUCKETS_NAME');
        return `https://${bucketName}.s3.amazonaws.com/${filePath}`;
    }
    async deleteFile(filePath) {
        const bucketName = this.configService.get('AWS_S3_BUCKETS_NAME');
        await this.s3Client.send(new _clients3.DeleteObjectCommand({
            Bucket: bucketName,
            Key: filePath
        }));
    }
    constructor(s3Client, configService){
        this.s3Client = s3Client;
        this.configService = configService;
    }
};
FileMetadataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('S3_CLIENT')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _clients3.S3Client === "undefined" ? Object : _clients3.S3Client,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], FileMetadataService);

//# sourceMappingURL=file-metadata.service.js.map