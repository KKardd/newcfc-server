import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AwsModule } from '@/module/infrastructure/aws.module';
import { FileMetadataService } from '@/port/service/file-metadata.service';
import { FileController } from '@/adapter/inbound/controller/file.controller';

@Module({
  imports: [AwsModule, ConfigModule],
  controllers: [FileController],
  providers: [
    {
      provide: FileMetadataService,
      useClass: FileMetadataService,
    },
  ],
  exports: [FileMetadataService],
})
export class FileModule {}
