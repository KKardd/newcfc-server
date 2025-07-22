import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { CreateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/create-work-history.dto';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { UpdateWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/update-work-history.dto';
import {
  WorkHistoryResponseDto,
  WorkHistoryChauffeurDto,
  WorkHistoryVehicleDto,
} from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';
import { WorkHistoryRepository } from '@/adapter/outbound/work-history.repository';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { convertKstToUtc } from '@/util/date';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceInPort } from '@/port/inbound/work-history-service.in-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class WorkHistoryService implements WorkHistoryServiceInPort {
  constructor(
    private readonly workHistoryRepository: WorkHistoryRepository,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
  ) {}

  async search(
    searchWorkHistory: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<WorkHistoryResponseDto>> {
    // 삭제 제외 조회
    const [workHistories, totalCount] = await this.workHistoryRepository.findAll(
      searchWorkHistory,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 근무 내역에 대해 차량과 기사 정보를 별도로 조회
    const responseDtos = await Promise.all(
      workHistories.map(async (workHistory) => {
        const dto = plainToInstance(WorkHistoryResponseDto, workHistory);

        // 기사 정보 조회
        if (workHistory.chauffeurId) {
          try {
            const chauffeur = await this.chauffeurServiceOutPort.findById(workHistory.chauffeurId);
            if (chauffeur) {
              dto.chauffeur = plainToInstance(
                WorkHistoryChauffeurDto,
                {
                  id: chauffeur.id,
                  name: chauffeur.name,
                  phone: chauffeur.phone,
                  type: chauffeur.type,
                },
              );
              dto.chauffeurName = chauffeur.name;
              dto.chauffeurPhone = chauffeur.phone;
            }
          } catch (error) {
            // 기사 정보를 찾을 수 없는 경우
            dto.chauffeur = null;
          }
        }

        // 차량 정보 조회
        if (workHistory.vehicleId) {
          try {
            const vehicle = await this.vehicleServiceOutPort.findById(workHistory.vehicleId);
            if (vehicle) {
              dto.vehicle = plainToInstance(
                WorkHistoryVehicleDto,
                {
                  id: vehicle.id,
                  vehicleNumber: vehicle.vehicleNumber,
                  modelName: vehicle.modelName,
                  vehicleStatus: vehicle.vehicleStatus,
                },
              );
              dto.vehicleNumber = vehicle.vehicleNumber;
            }
          } catch (error) {
            // 차량 정보를 찾을 수 없는 경우
            dto.vehicle = null;
          }
        }

        return dto;
      }),
    );

    return new PaginationResponse(responseDtos, pagination);
  }

  async detail(id: number): Promise<WorkHistoryResponseDto> {
    const workHistory = await this.workHistoryRepository.findById(id);
    return plainToInstance(WorkHistoryResponseDto, workHistory);
  }

  async create(createWorkHistory: CreateWorkHistoryDto): Promise<void> {
    const workHistory = plainToInstance(WorkHistory, {
      ...createWorkHistory,
      startTime: convertKstToUtc(createWorkHistory.startTime),
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
      updateData.startTime = convertKstToUtc(updateWorkHistory.startTime);
    }

    // endTime 처리
    if (updateWorkHistory.endTime) {
      updateData.endTime = convertKstToUtc(updateWorkHistory.endTime);

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
      status: DataStatus.COMPLETED,
    });

}

}
