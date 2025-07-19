import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { AssignChauffeurDto } from '@/adapter/inbound/dto/request/admin/assign-chauffeur.dto';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { AssignChauffeurResponseDto } from '@/adapter/inbound/dto/response/admin/assign-chauffeur-response.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { ApiSuccessResponse } from '@/adapter/inbound/dto/swagger.decorator';
import { UserRoleType } from '@/domain/enum/user-role.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { JwtAuthGuard } from '@/security/guard/jwt-auth.guard';
import { Roles } from '@/security/guard/user-role.decorator';
import { UserRolesGuard } from '@/security/guard/user-role.guard';

@ApiTags('Operation')
@ApiBearerAuth()
@Controller('operations')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRoleType.SUPER_ADMIN)
export class OperationController {
  constructor(private readonly operationService: OperationServiceInPort) {}

  @ApiOperation({ summary: '운행 목록 조회' })
  @ApiSuccessResponse(200, OperationResponseDto, { paginated: true })
  @Get()
  async search(
    @Query() searchOperation: SearchOperationDto,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>> {
    return await this.operationService.search(searchOperation, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '운행 상세 조회' })
  @ApiParam({ name: 'id', description: '운행 ID' })
  @ApiResponse({ status: 200, description: '운행 상세 정보', type: OperationResponseDto })
  async detail(@Param('id') id: number): Promise<OperationResponseDto> {
    return this.operationService.detail(id);
  }

  @Get(':id/admin')
  @ApiOperation({ summary: '관리자용 운행 상세 조회 (진행 상태 포함)' })
  @ApiParam({ name: 'id', description: '운행 ID' })
  @ApiResponse({ status: 200, description: '관리자용 운행 상세 정보 (진행 상태 포함)' })
  async getAdminDetail(@Param('id') id: number) {
    return this.operationService.getAdminOperationDetail(id);
  }

  @ApiOperation({ 
    summary: '관리자용 운행 정보 수정',
    description: `관리자용 운행 정보를 수정합니다.
    
**주요 기능:**
- 영수증/추가비용 입력 시 기사 상태 자동 전환 (PENDING_RECEIPT_INPUT → OPERATION_COMPLETED)
- wayPoints 업데이트 시 order 자동 재정렬 및 기존 wayPoints 삭제/재생성
- 일정 로그 수정 포함`
  })
  @ApiParam({ name: 'id', description: '운행 ID' })
  @Put(':id/admin')
  async updateAdmin(@Param('id') id: number, @Body() updateOperation: any) {
    return this.operationService.updateAdmin(id, updateOperation);
  }

  @ApiOperation({ summary: '운행 생성' })
  @Post()
  async create(@Body() createOperation: CreateOperationDto): Promise<void> {
    await this.operationService.create(createOperation);
  }

  @ApiOperation({ 
    summary: '운행 정보 수정',
    description: `운행 정보를 수정합니다.
    
**주요 기능:**
- 영수증/추가비용 입력 시 기사 상태 자동 전환 (PENDING_RECEIPT_INPUT → OPERATION_COMPLETED)
- wayPoints 업데이트 시 order 자동 재정렬 (기존 wayPoints는 자동으로 뒤로 밀려남)
- 예: order 2 위치에 새 wayPoint 추가 시, 기존 order 2,3 → order 3,4로 자동 변경`
  })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOperation: UpdateOperationDto): Promise<void> {
    await this.operationService.update(id, updateOperation);
  }

  @ApiOperation({ summary: '운행 삭제' })
  @Put(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.operationService.delete(id);
  }

  @ApiOperation({ 
    summary: '운행 취소',
    description: '운행을 취소하고 배정된 기사에게 취소 알림을 전송합니다.'
  })
  @Put(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: { reason?: string }
  ): Promise<void> {
    await this.operationService.cancel(id, body.reason);
  }

  @ApiOperation({ summary: '실시간 예약 배차하기' })
  @ApiSuccessResponse(200, AssignChauffeurResponseDto)
  @Post('assign-chauffeur')
  async assignChauffeur(@Body() assignDto: AssignChauffeurDto): Promise<AssignChauffeurResponseDto> {
    return await this.operationService.assignChauffeur(assignDto);
  }
}
