import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { SearchWorkHistoryDto } from '@/adapter/inbound/dto/request/work-history/search-work-history.dto';
import { WorkHistoryResponseDto } from '@/adapter/inbound/dto/response/work-history/work-history-response.dto';
import { WorkHistory } from '@/domain/entity/work-history.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { WorkHistoryServiceOutPort } from '@/port/outbound/work-history-service.out-port';

@Injectable()
export class WorkHistoryRepository implements WorkHistoryServiceOutPort {
  constructor(
    @InjectRepository(WorkHistory)
    private readonly repository: Repository<WorkHistory>,
  ) {}

  async findAll(
    searchWorkHistory: SearchWorkHistoryDto,
    paginationQuery: PaginationQuery,
  ): Promise<[WorkHistoryResponseDto[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('work_history')
      .leftJoin('chauffeur', 'chauffeur', 'work_history.chauffeur_id = chauffeur.id')
      .leftJoin('vehicle', 'vehicle', 'work_history.vehicle_id = vehicle.id')
      .select('work_history.*')
      .addSelect('chauffeur.id', 'chauffeur_id')
      .addSelect('chauffeur.name', 'chauffeur_name')
      .addSelect('chauffeur.phone', 'chauffeur_phone')
      .addSelect('chauffeur.type', 'chauffeur_type')
      .addSelect('vehicle.id', 'vehicle_id')
      .addSelect('vehicle.vehicle_number', 'vehicle_number')
      .addSelect('vehicle.model_name', 'vehicle_model_name')
      .addSelect('vehicle.vehicle_status', 'vehicle_status')
      .where('work_history.status != :deletedStatus', { deletedStatus: DataStatus.DELETED });

    if (searchWorkHistory.chauffeurId) {
      queryBuilder.andWhere('work_history.chauffeur_id = :chauffeurId', {
        chauffeurId: searchWorkHistory.chauffeurId,
      });
    }

    if (searchWorkHistory.vehicleId) {
      queryBuilder.andWhere('work_history.vehicle_id = :vehicleId', {
        vehicleId: searchWorkHistory.vehicleId,
      });
    }

    if (searchWorkHistory.startDate) {
      queryBuilder.andWhere('DATE(work_history.start_time) >= :startDate', {
        startDate: searchWorkHistory.startDate,
      });
    }

    if (searchWorkHistory.endDate) {
      queryBuilder.andWhere('DATE(work_history.start_time) <= :endDate', {
        endDate: searchWorkHistory.endDate,
      });
    }

    // 연도별 필터링
    if (searchWorkHistory.year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM work_history.start_time) = :year', {
        year: searchWorkHistory.year,
      });
    }

    // 월별 필터링
    if (searchWorkHistory.month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM work_history.start_time) = :month', {
        month: searchWorkHistory.month,
      });
    }

    if (searchWorkHistory.status) {
      queryBuilder.andWhere('work_history.status = :status', {
        status: searchWorkHistory.status,
      });
    }

    queryBuilder.orderBy('work_history.start_time', 'DESC').offset(paginationQuery.skip).limit(paginationQuery.countPerPage);

    const workHistories = await queryBuilder.getRawMany();
    const totalCount = await queryBuilder.getCount();

    const workHistoriesResponse: WorkHistoryResponseDto[] = workHistories.map((workHistory) => ({
      id: workHistory.id,
      chauffeurId: workHistory.chauffeur_id,
      chauffeurName: workHistory.chauffeur_name || null,
      chauffeurPhone: workHistory.chauffeur_phone || null,
      vehicleId: workHistory.vehicle_id,
      vehicleNumber: workHistory.vehicle_number || null,
      startTime: workHistory.start_time,
      endTime: workHistory.end_time,
      totalMinutes: workHistory.total_minutes,
      memo: workHistory.memo,
      status: workHistory.status,
      createdBy: workHistory.created_by,
      createdAt: workHistory.created_at,
      updatedBy: workHistory.updated_by,
      updatedAt: workHistory.updated_at,
      // Chauffeur 정보
      chauffeur: workHistory.chauffeur_id
        ? {
            id: workHistory.chauffeur_id,
            name: workHistory.chauffeur_name,
            phone: workHistory.chauffeur_phone,
            type: workHistory.chauffeur_type,
          }
        : null,
      // Vehicle 정보
      vehicle: workHistory.vehicle_id
        ? {
            id: workHistory.vehicle_id,
            vehicleNumber: workHistory.vehicle_number,
            modelName: workHistory.vehicle_model_name,
            vehicleStatus: workHistory.vehicle_status,
          }
        : null,
    }));

    return [workHistoriesResponse, totalCount];
  }

  async findById(id: number): Promise<WorkHistory> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async findActiveByChauffeurId(chauffeurId: number): Promise<WorkHistory | null> {
    return await this.repository.findOne({
      where: {
        chauffeurId,
        endTime: IsNull(),
        status: DataStatus.REGISTER,
      },
      order: { startTime: 'DESC' },
    });
  }

  async save(workHistory: WorkHistory): Promise<void> {
    await this.repository.save(workHistory);
  }

  async update(id: number, workHistory: Partial<WorkHistory>): Promise<void> {
    await this.repository.update(id, workHistory);
  }

  async updateStatus(id: number, status: DataStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
