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
    const fileKey = `${uploadType}/${uuidv4()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      }),
    );

    return {
      url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async getFileUrl(filePath: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKETS_NAME');
    return `https://${bucketName}.s3.amazonaws.com/${filePath}`;
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
