import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import {
  ChauffeurStatusChangeResponseDto,
  WayPointInfo,
} from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class ChauffeurService implements ChauffeurServiceInPort {
  constructor(
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly reservationServiceInPort: ReservationServiceInPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
  ) {}

  async search(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>> {
    const [chauffeurs, totalCount] = await this.chauffeurServiceOutPort.findAll(searchChauffeur, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(ChauffeurResponseDto, chauffeurs, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<ChauffeurResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    return plainToInstance(ChauffeurResponseDto, chauffeur, classTransformDefaultOptions);
  }

  async create(createChauffeur: CreateChauffeurDto): Promise<void> {
    const chauffeur = plainToInstance(Chauffeur, createChauffeur);
    await this.chauffeurServiceOutPort.save(chauffeur);
  }

  async update(id: number, updateChauffeur: UpdateChauffeurDto): Promise<void> {
    await this.chauffeurServiceOutPort.update(id, updateChauffeur);
  }

  async delete(id: number): Promise<void> {
    await this.chauffeurServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async changeStatus(chauffeurId: number, changeStatusDto: ChangeChauffeurStatusDto): Promise<ChauffeurStatusChangeResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

    // 현재 상태 검증
    if (chauffeur.chauffeurStatus !== changeStatusDto.prevStatus) {
      throw new Error('기사의 현재 상태가 요청한 이전 상태와 일치하지 않습니다.');
    }

    // 상태 업데이트
    await this.chauffeurServiceOutPort.update(chauffeurId, {
      chauffeurStatus: changeStatusDto.updateStatus,
    });

    const response = new ChauffeurStatusChangeResponseDto();
    response.chauffeurStatus = changeStatusDto.updateStatus;

    // 상태별 추가 로직 처리
    switch (changeStatusDto.updateStatus) {
      case ChauffeurStatus.MOVING_TO_DEPARTURE:
        // 예약 대기중 -> 출발지 이동: operation.startTime 설정 및 안심 전화번호 반환
        await this.handleMovingToDeparture(chauffeurId, response);
        break;

      case ChauffeurStatus.WAITING_FOR_PASSENGER:
        // 출발지 이동 -> 고객 탑승대기: 안심 전화번호 반환
        await this.handleWaitingForPassenger(chauffeurId, response);
        break;

      case ChauffeurStatus.IN_OPERATION:
        // 고객 탑승대기 -> 운행 중: 목적지 및 경유지 정보 반환
        await this.handleInOperation(chauffeurId, response);
        break;

      case ChauffeurStatus.WAITING_OPERATION:
        // 운행 중 -> 운행 대기: 안심 전화번호 반환
        await this.handleWaitingOperation(chauffeurId, response);
        break;

      case ChauffeurStatus.OPERATION_COMPLETED:
        // 운행 중 -> 운행 종료: operation.endTime 설정 및 운행시간 계산
        await this.handleOperationCompleted(chauffeurId, response);
        break;
    }

    return response;
  }

  private async handleMovingToDeparture(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      await this.operationServiceOutPort.update(currentOperation.id, {
        startTime: new Date(),
      });

      const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
      response.safetyPhone = reservation.safetyPhone ?? undefined;
    }
  }

  private async handleWaitingForPassenger(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
      response.safetyPhone = reservation.safetyPhone ?? undefined;
    }
  }

  private async handleInOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      const reservation = await this.reservationServiceInPort.detail(currentOperation.id);

      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ reservationId: reservation.id }, wayPointPagination);

      response.hasWayPoints = wayPoints.data.length > 0;

      if (wayPoints.data.length > 0) {
        response.wayPoints = wayPoints.data
          .sort((a, b) => a.order - b.order)
          .map((wp) => plainToInstance(WayPointInfo, wp, classTransformDefaultOptions));
      }
    }
  }

  private async handleWaitingOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
      response.safetyPhone = reservation.safetyPhone ?? undefined;
    }
  }

  private async handleOperationCompleted(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation && currentOperation.startTime) {
      const endTime = new Date();
      await this.operationServiceOutPort.update(currentOperation.id, {
        endTime,
      });

      const operationTimeMs = endTime.getTime() - currentOperation.startTime.getTime();
      response.operationTimeMinutes = Math.floor(operationTimeMs / (1000 * 60));
    }
  }

  private async getCurrentOperation(chauffeurId: number) {
    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 1;

    const operations = await this.operationServiceOutPort.findAll(
      { chauffeurId, status: DataStatus.REGISTER },
      operationPagination,
    );

    if (operations[1] > 0) {
      const currentTime = new Date();
      const validOperations = operations[0].filter((op) => !op.startTime || op.startTime >= currentTime || !op.endTime);

      return validOperations.length > 0 ? validOperations[0] : null;
    }

    return null;
  }
}
