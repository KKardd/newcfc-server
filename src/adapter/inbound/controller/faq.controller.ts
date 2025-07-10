import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  async search(@Query() paginationQuery: PaginationQuery): Promise<PaginationResponse<FaqResponseDto>> {
    return await this.faqServiceInPort.search(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'FAQ 상세 조회' })
  async detail(@Param('id', ParseIntPipe) id: number): Promise<FaqResponseDto> {
    return await this.faqServiceInPort.detail(id);
  }

  @Post()
  @ApiOperation({ summary: 'FAQ 생성' })
  async create(@Body() createFaqDto: CreateFaqDto): Promise<void> {
    await this.faqServiceInPort.create(createFaqDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'FAQ 수정' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateFaqDto: UpdateFaqDto): Promise<void> {
    await this.faqServiceInPort.update(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'FAQ 삭제' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.faqServiceInPort.delete(id);
  }
}
