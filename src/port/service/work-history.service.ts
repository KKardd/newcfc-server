import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/create-work-history.dto';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { UpdateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/update-work-history.dto';
import { WorkHistoryResponseDto } from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';
import { WorkHistoryRepository } from '@/adapter/outbound/work-history.repository';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceInPort } from '@/port/inbound/work-history-service.in-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class WorkHistoryService implements WorkHistoryServiceInPort {
  constructor(private readonly workHistoryRepository: WorkHistoryRepository) {}

  async search(
    searchWorkHistory: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WorkHistoryResponseDto>> {
    // 삭제 제외 조회
    const [workHistories, totalCount] = await this.workHistoryRepository.findAll(searchWorkHistory, paginationQuery, 'delete');
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(WorkHistoryResponseDto, workHistories, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<WorkHistoryResponseDto> {
    const workHistory = await this.workHistoryRepository.findById(id);
    return plainToInstance(WorkHistoryResponseDto, workHistory, classTransformDefaultOptions);
  }

  async create(createWorkHistory: CreateWorkHistoryDto): Promise<void> {
    const workHistory = plainToInstance(WorkHistory, {
      ...createWorkHistory,
      startTime: new Date(createWorkHistory.startTime),
    });
    await this.workHistoryRepository.save(workHistory);
  }

  async update(id: number, updateWorkHistory: UpdateWorkHistoryDto): Promise<void> {
    const updateData: Partial<WorkHistory> = {};

    // vehicleId 처리
    if (updateWorkHistory.vehicleId !== undefined) {
      updateData.vehicleId = updateWorkHistory.vehicleId;
    }

    // memo 처리
    if (updateWorkHistory.memo !== undefined) {
      updateData.memo = updateWorkHistory.memo;
    }

    // totalMinutes 처리
    if (updateWorkHistory.totalMinutes !== undefined) {
      updateData.totalMinutes = updateWorkHistory.totalMinutes;
    }

    // startTime 처리
    if (updateWorkHistory.startTime) {
      updateData.startTime = new Date(updateWorkHistory.startTime);
    }

    // endTime 처리
    if (updateWorkHistory.endTime) {
      updateData.endTime = new Date(updateWorkHistory.endTime);

      // 총 근무 시간 계산 (분) - totalMinutes가 명시적으로 설정되지 않은 경우에만
      if (updateWorkHistory.totalMinutes === undefined) {
        const existingWorkHistory = await this.workHistoryRepository.findById(id);
        const startTime = updateData.startTime || existingWorkHistory?.startTime;
        const endTime = updateData.endTime;

        if (startTime && endTime) {
          const diffMs = endTime.getTime() - startTime.getTime();
          updateData.totalMinutes = Math.floor(diffMs / (1000 * 60));
        }
      }
    }

    await this.workHistoryRepository.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.workHistoryRepository.updateStatus(id, DataStatus.DELETED);
  }

  async startWork(chauffeurId: number, vehicleId?: number): Promise<void> {
    // 이미 진행 중인 근무가 있는지 확인
    const activeWork = await this.workHistoryRepository.findActiveByChauffeurId(chauffeurId);
    if (activeWork) {
      throw new Error('이미 진행 중인 근무가 있습니다.');
    }

    const workHistory = plainToInstance(WorkHistory, {
      chauffeurId,
      vehicleId: vehicleId || null,
      startTime: new Date(),
      status: DataStatus.REGISTER,
    });

    await this.workHistoryRepository.save(workHistory);
  }

  async endWork(chauffeurId: number): Promise<void> {
    const activeWork = await this.workHistoryRepository.findActiveByChauffeurId(chauffeurId);
    if (!activeWork) {
      throw new Error('진행 중인 근무가 없습니다.');
    }

    const endTime = new Date();
    const diffMs = endTime.getTime() - activeWork.startTime.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    await this.workHistoryRepository.update(activeWork.id, {
      endTime,
      totalMinutes,
    });
  }
}
