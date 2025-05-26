import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateNoticeDto } from '@/adapter/inbound/dto/request/notice/create-notice.dto';
import { SearchNoticeDto } from '@/adapter/inbound/dto/request/notice/search-notice.dto';
import { UpdateNoticeDto } from '@/adapter/inbound/dto/request/notice/update-notice.dto';
import { NoticeResponseDto } from '@/adapter/inbound/dto/response/notice/notice-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { NoticeServiceInPort } from '@/port/inbound/notice-service.in-port';

@ApiTags('Notice')
@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeServiceInPort) {}

  @ApiOperation({ summary: '공지사항 목록 조회' })
  @ApiSuccessResponse(200, NoticeResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchNotice: SearchNoticeDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<NoticeResponseDto>> {
    return await this.noticeService.search(searchNotice, paginationQuery);
  }

  @ApiOperation({ summary: '공지사항 상세 조회' })
  @ApiSuccessResponse(200, NoticeResponseDto)
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<NoticeResponseDto> {
    return await this.noticeService.detail(id);
  }

  @ApiOperation({ summary: '공지사항 생성' })
  @Post()
  async create(@Body() createNotice: CreateNoticeDto): Promise<void> {
    await this.noticeService.create(createNotice);
  }

  @ApiOperation({ summary: '공지사항 수정' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotice: UpdateNoticeDto): Promise<void> {
    await this.noticeService.update(id, updateNotice);
  }

  @ApiOperation({ summary: '공지사항 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.noticeService.delete(id);
  }
}
