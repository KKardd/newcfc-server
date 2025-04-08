import { Module } from '@nestjs/common';

import { S3Provider } from '@/infrastructure/aws/s3.provider';

@Module({
  providers: [...S3Provider],
  exports: [...S3Provider],
})
export class AwsModule {}
