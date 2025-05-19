import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { v4 } from 'uuid';

import { ResponseTokenDto } from '@/adapter/inbound/dto/response/response-token.dto';
import { Admin } from '@/domain/entity/admin.entity';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { TokenPayload, UserAccessTokenPayload, UserRefreshTokenPayload } from '@/security/jwt/token.payload';

export const ISS = 'NEWCFC';
export const SYSTEM_ISS = 'SYSTEM';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: TokenPayload<UserAccessTokenPayload>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      algorithm: 'HS512',
    });
  }

  async verifyAccessToken(accessToken: string): Promise<TokenPayload<UserAccessTokenPayload>> {
    return this.jwtService.verify(accessToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  createRefreshToken(payload: TokenPayload<UserRefreshTokenPayload>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      algorithm: 'HS512',
    });
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenPayload<UserRefreshTokenPayload>> {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  createToken(user: Admin | Chauffeur): ResponseTokenDto {
    const userAccessTokenPayload: TokenPayload<UserAccessTokenPayload> = {
      iss: ISS,
      sub: user.id.toString(),
      jti: v4(),
      payload: {
        tenantId: 'tenantId' in user ? (user.tenantId as number) : 0,
        userId: user.id,
        email: 'email' in user ? (user.email as string) : user.phone,
        name: user.name,
        roles: [user.role],
      },
    };

    const userRefreshTokenPayload: TokenPayload<UserRefreshTokenPayload> = {
      iss: ISS,
      sub: user.id.toString(),
      jti: v4(),
      payload: {
        tenantId: 'tenantId' in user ? (user.tenantId as number) : 0,
        userId: user.id,
      },
    };

    const accessToken = this.createAccessToken(userAccessTokenPayload);
    const refreshToken = this.createRefreshToken(userRefreshTokenPayload);

    const createdResponseTokenDto = new ResponseTokenDto();
    createdResponseTokenDto.accessToken = accessToken;
    createdResponseTokenDto.refreshToken = refreshToken;

    return createdResponseTokenDto;
  }

  createSystemAccessToken(): string {
    const userAccessTokenPayload: TokenPayload<UserAccessTokenPayload> = {
      iss: SYSTEM_ISS,
      sub: SYSTEM_ISS,
      jti: v4(),
      payload: {
        tenantId: 0,
        userId: 0,
        email: SYSTEM_ISS,
        name: SYSTEM_ISS,
        roles: [UserRoleType.SUPER_ADMIN],
      },
    };

    return this.createAccessToken(userAccessTokenPayload);
  }
}
