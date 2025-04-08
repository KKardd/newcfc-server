import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectsCommand, PutObjectCommand, PutObjectCommandOutput, S3Client, S3ServiceException } from '@aws-sdk/client-s3';

import { FileUploadType } from '@/domain/enum/file-upload-type.enum';
import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { FileMetadataServiceOutPort } from '@/port/outbound/file-metadata-service.out-port';

export default class FileMetadataService implements FileMetadataServiceOutPort {
  private readonly BUCKET_NAME: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('S3_CLIENT') private s3Client: S3Client,
  ) {
    this.BUCKET_NAME = this.configService.get('AWS_S3_BUCKETS_NAME') as string;
  }

  async upload(
    uploadType: FileUploadType,
    serialId: number,
    file: Express.Multer.File,
  ): Promise<{ url: string; mimeType: string; fileSize: number }> {
    const decodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    let filePath = '';

    switch (uploadType) {
      case FileUploadType.CUSTOM_EMISSION_FACTOR_REFERENCE:
        if (file.size >= 31457280) {
          throw new CustomException(ErrorCode.FILE_SIZE_EXCEEDED);
        }
        filePath += `custom-emission-factor/id-${serialId}`;
        break;
    }

    let putObjectCommandOutput: PutObjectCommandOutput | null = null;

    try {
      const key = `${filePath}/${decodedFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      putObjectCommandOutput = await this.s3Client.send(command);

      return { url: key, mimeType: file.mimetype, fileSize: file.size };
    } catch (error) {
      if (error instanceof S3ServiceException) {
        throw error;
      }

      if (putObjectCommandOutput?.ETag) {
        const deleteCommand = new DeleteObjectsCommand({ Bucket: this.BUCKET_NAME, Delete: { Objects: [{ Key: filePath }] } });

        await this.s3Client.send(deleteCommand);
      }

      throw error;
    }
  }
}
