import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateAdminDto } from '@/adapter/inbound/dto/request/admin/create-admin.dto';
import { SearchAdminDto } from '@/adapter/inbound/dto/request/admin/search-admin.dto';
import { SearchAvailableChauffeursDto } from '@/adapter/inbound/dto/request/admin/search-available-chauffeurs.dto';
import { UpdateAdminDto } from '@/adapter/inbound/dto/request/admin/update-admin.dto';
import { AdminResponseDto } from '@/adapter/inbound/dto/response/admin/admin-response.dto';
import { AdminProfileResponseDto } from '@/adapter/inbound/dto/response/admin/admin-profile-response.dto';
import { AvailableChauffeursResponseDto } from '@/adapter/inbound/dto/response/admin/available-chauffeurs-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { CustomException } from '@/exception/custom.exception';
import { ErrorCode } from '@/exception/error-code.enum';
import { AdminServiceInPort } from '@/port/inbound/admin-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';
import { UserToken } from '@/security/jwt/user-token.decorator';
import { UserAccessTokenPayload } from '@/security/jwt/token.payload';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminServiceInPort) {}

  @ApiOperation({ summary: '관리자 목록 조회' })
  @ApiSuccessResponse(200, AdminResponseDto, { paginated: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRoleType.SUPER_ADMIN)
  @Get()
  async search(
    @Query() searchAdmin: SearchAdminDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<AdminResponseDto>> {
    return await this.adminService.search(searchAdmin, paginationQuery);
  }

  @ApiOperation({ summary: '관리자 상세 조회' })
  @ApiSuccessResponse(200, AdminResponseDto)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRoleType.SUPER_ADMIN)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<AdminResponseDto> {
    return await this.adminService.detail(id);
  }

  @ApiOperation({ summary: '관리자 생성 (회원가입)' })
  @Post()
  async create(@Body() createAdmin: CreateAdminDto): Promise<void> {
    await this.adminService.create(createAdmin);
  }

  @ApiOperation({ summary: '관리자 정보 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRoleType.SUPER_ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAdmin: UpdateAdminDto): Promise<void> {
    await this.adminService.update(id, updateAdmin);
  }

  @ApiOperation({ summary: '관리자 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRoleType.SUPER_ADMIN)
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.delete(id);
  }

  @ApiOperation({ summary: '예약 배차용 사용 가능한 기사 및 미배정 차량 조회' })
  @ApiSuccessResponse(200, AvailableChauffeursResponseDto)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @Roles(UserRoleType.SUPER_ADMIN)
  @Post('available-chauffeurs')
  async getAvailableChauffeurs(@Body() searchDto: SearchAvailableChauffeursDto): Promise<AvailableChauffeursResponseDto> {
    return await this.adminService.getAvailableChauffeurs(searchDto);
  }

  @ApiOperation({ summary: '내 계정 승인 여부 조회' })
  @ApiSuccessResponse(200, AdminProfileResponseDto)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async getMyProfile(@UserToken() user: UserAccessTokenPayload): Promise<AdminProfileResponseDto> {
    // 관리자 역할만 접근 가능하도록 체크
    const isAdmin = user.roles.includes(UserRoleType.SUPER_ADMIN) || user.roles.includes(UserRoleType.SUB_ADMIN);
    if (!isAdmin) {
      throw new CustomException(ErrorCode.FORBIDDEN_ROLE);
    }

    return await this.adminService.getMyProfile(user.userId);
  }
}
