import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/create-work-history.dto';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { UpdateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/update-work-history.dto';
import { WorkHistoryResponseDto } from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';
import { WorkHistoryService } from '@/port/service/work-history.service';

@ApiTags('근무 내역')
@Controller('work-histories')
export class WorkHistoryController {
  constructor(private readonly workHistoryService: WorkHistoryService) {}

  @Get()
  @ApiOperation({ summary: '근무 내역 목록 조회' })
  @ApiResponse({ type: PaginationResponse<WorkHistoryResponseDto> })
  async search(
    @Query() searchWorkHistory: SearchWorkHistoryDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WorkHistoryResponseDto>> {
    return this.workHistoryService.search(searchWorkHistory, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '근무 내역 상세 조회' })
  @ApiResponse({ type: WorkHistoryResponseDto })
  async detail(@Param('id', ParseIntPipe) id: number): Promise<WorkHistoryResponseDto> {
    return this.workHistoryService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '근무 내역 생성' })
  async create(@Body() createWorkHistory: CreateWorkHistoryDto): Promise<void> {
    return this.workHistoryService.create(createWorkHistory);
  }

  @Put(':id')
  @ApiOperation({ summary: '근무 내역 수정' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateWorkHistory: UpdateWorkHistoryDto): Promise<void> {
    return this.workHistoryService.update(id, updateWorkHistory);
  }

  @Delete(':id')
  @ApiOperation({ summary: '근무 내역 삭제' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.workHistoryService.delete(id);
  }

  @Post('start/:chauffeurId')
  @ApiOperation({ summary: '근무 시작 (차량 인수)' })
  async startWork(@Param('chauffeurId', ParseIntPipe) chauffeurId: number, @Body() body?: { vehicleId?: number }): Promise<void> {
    return this.workHistoryService.startWork(chauffeurId, body?.vehicleId);
  }

  @Post('end/:chauffeurId')
  @ApiOperation({ summary: '근무 종료 (차량 반납)' })
  async endWork(@Param('chauffeurId', ParseIntPipe) chauffeurId: number): Promise<void> {
    return this.workHistoryService.endWork(chauffeurId);
  }
}
