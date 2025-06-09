import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from '@/domain/entity/refresh-token.entity';
import { RefreshTokenService } from '@/infrastructure/refresh-token.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
