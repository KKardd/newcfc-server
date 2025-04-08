import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { AwsModule } from '@/module/infrastructure/aws.module';
import { FileMetadataServiceOutPort } from '@/port/outbound/file-metadata-service.out-port';
import FileMetadataService from '@/port/service/file-metadata.service';

@Module({
  imports: [MulterModule.register({ storage: memoryStorage() }), AwsModule],
  providers: [{ provide: FileMetadataServiceOutPort, useClass: FileMetadataService }],
  exports: [{ provide: FileMetadataServiceOutPort, useClass: FileMetadataService }],
})
export class FileModule {}
