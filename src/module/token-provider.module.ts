import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenProvider } from '@/security/jwt/token.provider';
import { RefreshTokenModule } from '@/module/refresh-token.module';

@Global()
@Module({
  imports: [
    RefreshTokenModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET') || 'defaultSecretKey',
        signOptions: {
          expiresIn: parseInt(configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'), 10),
          algorithm: 'HS512',
        },
      }),
    }),
  ],
  providers: [TokenProvider],
  exports: [TokenProvider],
})
export class TokenProviderModule {}
