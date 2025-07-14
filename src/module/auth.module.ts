import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@/adapter/inbound/controller/auth.controller';
import { AuthService } from '@/application/service/auth.service';
import { Admin } from '@/domain/entity/admin.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';

import { TokenProviderModule } from './token-provider.module';
import { RefreshTokenModule } from './refresh-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Chauffeur]), TokenProviderModule, RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
