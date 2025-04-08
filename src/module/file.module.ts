import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AwsModule } from '@/module/infrastructure/aws.module';
import { FileMetadataService } from '@/port/service/file-metadata.service';

@Module({
  imports: [AwsModule, ConfigModule],
  providers: [FileMetadataService],
  exports: [FileMetadataService],
})
export class FileModule {}
