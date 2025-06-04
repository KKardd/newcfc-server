import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdminLoginDto, ChauffeurLoginDto } from '@/adapter/inbound/dto/request/login.dto';
import { ResponseTokenDto } from '@/adapter/inbound/dto/response/response-token.dto';
import { AuthService } from '@/application/service/auth.service';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: '관리자 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: ResponseTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 로그인 정보',
  })
  async adminLogin(@Body() loginDto: AdminLoginDto): Promise<ResponseTokenDto> {
    return this.authService.adminLogin(loginDto);
  }

  @Post('chauffeur/login')
  @ApiOperation({ summary: '기사 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: ResponseTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 로그인 정보',
  })
  async chauffeurLogin(@Body() loginDto: ChauffeurLoginDto): Promise<ResponseTokenDto> {
    return this.authService.chauffeurLogin(loginDto);
  }
}
