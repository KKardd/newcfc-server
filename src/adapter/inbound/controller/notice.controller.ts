import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateNoticeDto } from '@/adapter/inbound/dto/request/notice/create-notice.dto';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { UpdateNoticeDto } from '@/adapter/inbound/dto/request/notice/update-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { NoticeServiceInPort } from '@/port/inbound/notice-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('Notice')
@ApiBearerAuth()
@Controller('notices')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
export class NoticeController {
  constructor(private readonly noticeService: NoticeServiceInPort) {}

  @ApiOperation({ summary: '공지사항 목록 조회' })
  @ApiSuccessResponse(200, NoticeResponseDto, { paginated: true })
  @Roles(UserRoleType.CHAUFFEUR)
  @Get()
  async search(
    @Query() searchNotice: SearchNoticeDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<NoticeResponseDto>> {
    return await this.noticeService.search(searchNotice, paginationQuery);
  }

  @ApiOperation({ summary: '팝업 공지사항 목록 조회' })
  @ApiSuccessResponse(200, NoticeResponseDto, { isArray: true })
  @Roles(UserRoleType.CHAUFFEUR)
  @Get('popup')
  async getPopupNotices(): Promise<NoticeResponseDto[]> {
    return await this.noticeService.getPopupNotices();
  }

  @ApiOperation({ summary: '공지사항 상세 조회' })
  @ApiSuccessResponse(200, NoticeResponseDto)
  @Roles(UserRoleType.CHAUFFEUR)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<NoticeResponseDto> {
    return await this.noticeService.detail(id);
  }

  @ApiOperation({ summary: '공지사항 생성' })
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Post()
  async create(@Body() createNotice: CreateNoticeDto): Promise<void> {
    await this.noticeService.create(createNotice);
  }

  @ApiOperation({ summary: '공지사항 정보 수정' })
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotice: UpdateNoticeDto): Promise<void> {
    await this.noticeService.update(id, updateNotice);
  }

  @ApiOperation({ summary: '공지사항 삭제' })
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SUB_ADMIN)
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.noticeService.delete(id);
  }
}
