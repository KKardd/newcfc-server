import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateScheduleDto } from '@/adapter/inbound/dto/request/schedule/create-schedule.dto';
import { SearchScheduleDto } from '@/adapter/inbound/dto/request/schedule/search-schedule.dto';
import { ScheduleResponseDto } from '@/adapter/inbound/dto/response/schedule/schedule-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { ScheduleServiceInPort } from '@/port/inbound/schedule-service.in-port';

@ApiTags('Schedule')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleServiceInPort) {}

  @Get()
  @ApiOperation({ summary: 'Schedule 목록 조회' })
  @ApiSuccessResponse(200, ScheduleResponseDto, { isArray: true, paginated: true })
  async getSchedules(
    @Query() searchSchedule: SearchScheduleDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ScheduleResponseDto>> {
    return this.scheduleService.search(searchSchedule, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Schedule 상세 조회' })
  @ApiSuccessResponse(200, ScheduleResponseDto)
  async getSchedule(@Param('id') id: number): Promise<ScheduleResponseDto> {
    return this.scheduleService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Schedule 생성' })
  @ApiSuccessResponse(201, String)
  async createSchedule(@Body() createSchedule: CreateScheduleDto): Promise<string> {
    await this.scheduleService.create(createSchedule);
    return 'Schedule이 생성되었습니다.';
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Schedule 삭제' })
  @ApiSuccessResponse(200, String)
  async deleteSchedule(@Param('id') id: number): Promise<string> {
    await this.scheduleService.delete(id);
    return 'Schedule이 삭제되었습니다.';
  }

  @Get('operation/:operationId')
  @ApiOperation({ summary: '운행별 Schedule 목록 조회' })
  @ApiSuccessResponse(200, ScheduleResponseDto, { isArray: true })
  async getSchedulesByOperation(@Param('operationId') operationId: number): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.findByOperationId(operationId);
  }
}
