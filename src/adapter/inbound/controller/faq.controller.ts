import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateFaqDto } from '@/adapter/inbound/dto/request/faq/create-faq.dto';
import { UpdateFaqDto } from '@/adapter/inbound/dto/request/faq/update-faq.dto';
import { FaqResponseDto } from '@/adapter/inbound/dto/response/faq/faq-response.dto';
import { FaqServiceInPort } from '@/port/inbound/faq-service.in-port';

@Controller('faqs')
@ApiTags('FAQ API')
export class FaqController {
  constructor(private readonly faqServiceInPort: FaqServiceInPort) {}

  @Get()
  @ApiOperation({ summary: 'FAQ 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: PaginationResponse<FaqResponseDto> })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async search(@Query() paginationQuery: PaginationQuery): Promise<PaginationResponse<FaqResponseDto>> {
    return await this.faqServiceInPort.search(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'FAQ 상세 조회' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: '성공', type: FaqResponseDto })
  @ApiResponse({ status: 404, description: 'FAQ를 찾을 수 없음' })
  async detail(@Param('id', ParseIntPipe) id: number): Promise<FaqResponseDto> {
    return await this.faqServiceInPort.detail(id);
  }

  @Post()
  @ApiOperation({ summary: 'FAQ 생성' })
  @ApiBody({ type: CreateFaqDto })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() createFaqDto: CreateFaqDto): Promise<void> {
    await this.faqServiceInPort.create(createFaqDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'FAQ 수정' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiBody({ type: UpdateFaqDto })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: 'FAQ를 찾을 수 없음' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateFaqDto: UpdateFaqDto): Promise<void> {
    await this.faqServiceInPort.update(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'FAQ 삭제' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: 'FAQ를 찾을 수 없음' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.faqServiceInPort.delete(id);
  }
}
