import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { FileUploadType } from '@/domain/enum/file-upload-type.enum';
import { FileMetadataServiceOutPort } from '@/port/outbound/file-metadata-service.out-port';

@Injectable()
export class FileMetadataService implements FileMetadataServiceOutPort {
  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async upload(
    uploadType: FileUploadType,
    file: Express.Multer.File,
  ): Promise<{ url: string; mimeType: string; fileSize: number }> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKETS_NAME');
    const region = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';
    
    // 파일명에서 특수문자 제거 및 안전한 파일명 생성
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${uploadType}/${uuidv4()}-${sanitizedFileName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      }),
    );

    // 올바른 region을 포함한 URL 생성
    return {
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(fileKey)}`,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async getFileUrl(filePath: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKETS_NAME');
    const region = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(filePath)}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKETS_NAME');

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      }),
    );
  }
}
