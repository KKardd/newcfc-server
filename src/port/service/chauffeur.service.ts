import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { AssignedVehicleResponseDto } from '@/adapter/inbound/dto/response/chauffeur/assigned-vehicle-response.dto';
import { ChauffeurProfileResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-profile-response.dto';
import { ChauffeurResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import {
  ChauffeurStatusChangeResponseDto,
  WayPointInfo,
} from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import {
  CurrentOperationResponseDto,
  CurrentReservationDto,
  CurrentWayPointDto,
} from '@/adapter/inbound/dto/response/chauffeur/current-operation-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';

@Injectable()
export class ChauffeurService implements ChauffeurServiceInPort {
  constructor(
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly vehicleServiceOutPort: VehicleServiceOutPort,
    private readonly realTimeDispatchServiceOutPort: RealTimeDispatchServiceOutPort,
    private readonly reservationServiceInPort: ReservationServiceInPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
    private readonly wayPointServiceOutPort: WayPointServiceOutPort,
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

    // 기사 상태 변경 시 현재 위치의 waypoint에 상태 저장
    await this.updateWayPointChauffeurStatus(chauffeurId, changeStatusDto.updateStatus);

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

  // 기사 전용 메서드들
  async getMyProfile(chauffeurId: number): Promise<ChauffeurProfileResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    return plainToInstance(ChauffeurProfileResponseDto, chauffeur, classTransformDefaultOptions);
  }

  async getMyAssignedVehicle(chauffeurId: number): Promise<AssignedVehicleResponseDto | null> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

    if (!chauffeur.vehicleId) {
      return null;
    }

    const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
    return plainToInstance(AssignedVehicleResponseDto, vehicle, classTransformDefaultOptions);
  }

  async getMyCurrentOperation(chauffeurId: number): Promise<CurrentOperationResponseDto | null> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);

    if (!currentOperation) {
      return null;
    }

    const response = plainToInstance(CurrentOperationResponseDto, currentOperation, classTransformDefaultOptions);

    // 예약 정보 조회 (일반 예약인 경우)
    if (currentOperation.type === OperationType.REGULAR) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.reservation = plainToInstance(CurrentReservationDto, reservation, classTransformDefaultOptions);
      } catch (error) {
        // 예약 정보가 없는 경우
        response.reservation = null;
      }
    }

    // 경유지 정보 조회 (운행에서 직접 조회)
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);
      response.wayPoints = wayPoints.data
        .sort((a, b) => a.order - b.order)
        .map((wp) => plainToInstance(CurrentWayPointDto, wp, classTransformDefaultOptions));
    } catch (error) {
      response.wayPoints = [];
    }

    // 실시간 배차 정보 조회 (실시간 배차인 경우)
    if (currentOperation.type === OperationType.REALTIME && currentOperation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(currentOperation.realTimeDispatchId);
        response.departureAddress = realTimeDispatch.departureAddress;
        response.destinationAddress = realTimeDispatch.destinationAddress;
      } catch (error) {
        // 실시간 배차 정보가 없는 경우
        response.departureAddress = null;
        response.destinationAddress = null;
      }
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

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);

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

    const operations = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

    if (operations[1] > 0) {
      const currentTime = new Date();
      const validOperations = operations[0].filter((op) => !op.startTime || op.startTime >= currentTime || !op.endTime);

      return validOperations.length > 0 ? validOperations[0] : null;
    }

    return null;
  }

  /**
   * 기사 상태 변경 시 현재 위치의 waypoint에 기사 상태를 저장하는 메서드
   */
  private async updateWayPointChauffeurStatus(chauffeurId: number, chauffeurStatus: ChauffeurStatus): Promise<void> {
    try {
      // 현재 기사의 진행 중인 operation 조회
      const currentOperation = await this.getCurrentOperation(chauffeurId);

      if (!currentOperation) {
        return; // 진행 중인 운행이 없으면 waypoint 업데이트 불필요
      }

      // 해당 operation의 waypoint들 조회
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPointsResponse = await this.wayPointServiceInPort.search(
        { operationId: currentOperation.id, status: DataStatus.REGISTER },
        wayPointPagination,
      );

      if (wayPointsResponse.data.length === 0) {
        return; // waypoint가 없으면 업데이트 불필요
      }

      // waypoint들을 order 순으로 정렬
      const wayPoints = wayPointsResponse.data.sort((a, b) => a.order - b.order);

      // 기사 상태에 따른 현재 위치 waypoint 찾기
      let targetWayPointId: number | null = null;

      switch (chauffeurStatus) {
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          // 출발지에 도착 - 첫 번째 waypoint (order=1)
          const firstWayPoint = wayPoints.find((wp) => wp.order === 1);
          if (firstWayPoint) {
            targetWayPointId = firstWayPoint.id;
          }
          break;

        case ChauffeurStatus.WAITING_OPERATION:
          // 경유지에 도착 - 현재 진행 중인 waypoint를 찾아야 함
          // 여기서는 가장 최근에 업데이트된 waypoint 다음 순서를 사용
          // 실제 구현에서는 더 정교한 로직이 필요할 수 있음
          for (let i = 0; i < wayPoints.length; i++) {
            // 기존에 chauffeurStatus가 없는 waypoint 중 첫 번째를 선택
            const wayPoint = await this.wayPointServiceOutPort.findById(wayPoints[i].id);
            if (wayPoint && !wayPoint.chauffeurStatus) {
              targetWayPointId = wayPoint.id;
              break;
            }
          }
          break;

        case ChauffeurStatus.OPERATION_COMPLETED:
          // 운행 완료 - 마지막 waypoint
          const lastWayPoint = wayPoints[wayPoints.length - 1];
          if (lastWayPoint) {
            targetWayPointId = lastWayPoint.id;
          }
          break;

        default:
          // 다른 상태들은 waypoint 업데이트 불필요
          break;
      }

      // 대상 waypoint에 기사 상태 업데이트
      if (targetWayPointId) {
        await this.wayPointServiceOutPort.update(targetWayPointId, {
          chauffeurStatus: chauffeurStatus,
        });
      }
    } catch (error) {
      // waypoint 업데이트 실패 시 로그만 남기고 전체 플로우는 계속 진행
      console.error('Failed to update waypoint chauffeur status:', error);
    }
  }
}
