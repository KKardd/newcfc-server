import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { ChangeChauffeurStatusDto } from '@/adapter/inbound/dto/request/chauffeur/change-status.dto';
import { CreateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/create-chauffeur.dto';
import { SearchChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/search-chauffeur.dto';
import { UpdateChauffeurDto } from '@/adapter/inbound/dto/request/chauffeur/update-chauffeur.dto';
import { UpdateLocationDto } from '@/adapter/inbound/dto/request/chauffeur/update-location.dto';
import { CreateScheduleDto } from '@/adapter/inbound/dto/request/schedule/create-schedule.dto';
import { AssignedVehicleResponseDto } from '@/adapter/inbound/dto/response/chauffeur/assigned-vehicle-response.dto';
import { ChauffeurProfileResponseDto } from '@/adapter/inbound/dto/response/chauffeur/chauffeur-profile-response.dto';
import {
  ChauffeurResponseDto,
  VehicleInfoDto,
  GarageInfoDto,
} from '@/adapter/inbound/dto/response/chauffeur/chauffeur-response.dto';
import {
  CurrentOperationResponseDto,
  CurrentReservationDto,
  CurrentWayPointDto,
} from '@/adapter/inbound/dto/response/chauffeur/current-operation-response.dto';
import { LocationResponseDto } from '@/adapter/inbound/dto/response/chauffeur/location-response.dto';
import {
  NearestReservationResponseDto,
  NextOperationDto,
  NextReservationDto,
  NextWayPointDto,
} from '@/adapter/inbound/dto/response/chauffeur/nearest-reservation-response.dto';
import {
  ChauffeurStatusChangeResponseDto,
  WayPointInfo,
} from '@/adapter/inbound/dto/response/chauffeur/status-change-response.dto';
import { Chauffeur } from '@/domain/entity/chauffeur.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { ChauffeurType } from '@/domain/enum/chauffeur-type.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { ChauffeurServiceInPort } from '@/port/inbound/chauffeur-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { ScheduleServiceInPort } from '@/port/inbound/schedule-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { GarageServiceOutPort } from '@/port/outbound/garage-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { RealTimeDispatchServiceOutPort } from '@/port/outbound/real-time-dispatch-service.out-port';
import { VehicleServiceOutPort } from '@/port/outbound/vehicle-service.out-port';
import { WayPointServiceOutPort } from '@/port/outbound/way-point-service.out-port';
import { WorkHistoryService } from '@/port/service/work-history.service';
import {} from '@/validate/serialization';

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
    private readonly workHistoryService: WorkHistoryService,
    private readonly garageServiceOutPort: GarageServiceOutPort,
    private readonly scheduleServiceInPort: ScheduleServiceInPort,
  ) {}

  async search(
    searchChauffeur: SearchChauffeurDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<ChauffeurResponseDto>> {
    const [chauffeurs, totalCount] = await this.chauffeurServiceOutPort.findAll(
      searchChauffeur,
      paginationQuery,
      DataStatus.DELETED,
    );
    const pagination = new Pagination({ totalCount, paginationQuery });

    // 각 기사에 대해 관련 데이터를 조회하고 매핑
    const chauffeurDtos = await Promise.all(
      chauffeurs.map(async (chauffeur) => {
        const chauffeurDto = plainToInstance(ChauffeurResponseDto, chauffeur);

        // 차량 정보 조회
        if (chauffeur.vehicleId) {
          try {
            const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
            if (vehicle) {
              chauffeurDto.vehicle = plainToInstance(VehicleInfoDto, {
                id: vehicle.id,
                vehicleNumber: vehicle.vehicleNumber,
                modelName: vehicle.modelName,
                garageId: vehicle.garageId,
                vehicleStatus: vehicle.vehicleStatus,
                status: vehicle.status,
                createdBy: vehicle.createdBy,
                createdAt: vehicle.createdAt,
                updatedBy: vehicle.updatedBy,
                updatedAt: vehicle.updatedAt,
              });

              // 차고지 정보 조회 (차량이 있는 경우)
              if (vehicle.garageId) {
                try {
                  const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
                  if (garage) {
                    chauffeurDto.garage = plainToInstance(GarageInfoDto, {
                      id: garage.id,
                      name: garage.name,
                      address: garage.address,
                      addressDetail: garage.detailAddress,
                      status: garage.status,
                      createdBy: garage.createdBy,
                      createdAt: garage.createdAt,
                      updatedBy: garage.updatedBy,
                      updatedAt: garage.updatedAt,
                    });
                  }
                } catch {
                  chauffeurDto.garage = null;
                }
              }
            }
          } catch {
            chauffeurDto.vehicle = null;
          }
        }

        return chauffeurDto;
      }),
    );

    return new PaginationResponse(chauffeurDtos, pagination);
  }

  async detail(id: number): Promise<ChauffeurResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 삭제된 쇼퍼인 경우 예외 처리
    if (chauffeur.status === DataStatus.DELETED) {
      throw new Error('삭제된 기사 정보는 조회할 수 없습니다.');
    }

    const chauffeurDto = plainToInstance(ChauffeurResponseDto, chauffeur);

    // 차량 정보 조회
    if (chauffeur.vehicleId) {
      try {
        const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);
        if (vehicle) {
          chauffeurDto.vehicle = plainToInstance(VehicleInfoDto, {
            id: vehicle.id,
            vehicleNumber: vehicle.vehicleNumber,
            modelName: vehicle.modelName,
            garageId: vehicle.garageId,
            vehicleStatus: vehicle.vehicleStatus,
            status: vehicle.status,
            createdBy: vehicle.createdBy,
            createdAt: vehicle.createdAt,
            updatedBy: vehicle.updatedBy,
            updatedAt: vehicle.updatedAt,
          });

          // 차고지 정보 조회 (차량이 있는 경우)
          if (vehicle.garageId) {
            try {
              const garage = await this.garageServiceOutPort.findById(vehicle.garageId);
              if (garage) {
                chauffeurDto.garage = plainToInstance(GarageInfoDto, {
                  id: garage.id,
                  name: garage.name,
                  address: garage.address,
                  addressDetail: garage.detailAddress,
                  status: garage.status,
                  createdBy: garage.createdBy,
                  createdAt: garage.createdAt,
                  updatedBy: garage.updatedBy,
                  updatedAt: garage.updatedAt,
                });
              }
            } catch {
              chauffeurDto.garage = null;
            }
          }
        }
      } catch {
        chauffeurDto.vehicle = null;
      }
    }

    return chauffeurDto;
  }

  async create(createChauffeur: CreateChauffeurDto): Promise<void> {
    const chauffeur = plainToInstance(Chauffeur, createChauffeur);
    await this.chauffeurServiceOutPort.save(chauffeur);
  }

  async update(id: number, updateChauffeur: UpdateChauffeurDto): Promise<void> {
    const existingChauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!existingChauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 타입 변경이 시도된 경우 검증
    if (updateChauffeur.type !== undefined && updateChauffeur.type !== existingChauffeur.type) {
      // 현재 또는 미래 운행이 있는지 확인
      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 100;

      const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId: id }, operationPagination);

      const currentTime = new Date();
      const hasActiveOperations = operations.some((op) => {
        // 진행 중이거나 미래의 운행이 있는지 확인
        return (
          op.status !== DataStatus.DELETED &&
          op.status !== DataStatus.COMPLETED &&
          (!op.startTime || op.startTime >= currentTime || !op.endTime)
        );
      });

      if (hasActiveOperations) {
        const error = new Error('행사 예약이 있는 쇼퍼의 타입은 변경할 수 없습니다.');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    await this.chauffeurServiceOutPort.update(id, updateChauffeur);
  }

  async delete(id: number): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(id);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    // 이미 삭제된 쇼퍼인 경우 예외 처리
    if (chauffeur.status === DataStatus.DELETED) {
      throw new Error('이미 삭제된 기사입니다.');
    }

    await this.chauffeurServiceOutPort.update(id, { status: DataStatus.DELETED });
  }

  async changeStatus(chauffeurId: number, changeStatusDto: ChangeChauffeurStatusDto): Promise<ChauffeurStatusChangeResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    const previousStatus = chauffeur.chauffeurStatus;

    // 기존 상태에서 허용되지 않는 상태 변경인지 검증
    // (기존 검증 로직 유지)

    // 기사 상태 업데이트
    await this.chauffeurServiceOutPort.update(chauffeurId, {
      chauffeurStatus: changeStatusDto.updateStatus,
    });

    // 기사 상태 변경 시 현재 위치의 waypoint에 상태 저장
    await this.updateWayPointChauffeurStatus(chauffeurId, changeStatusDto.updateStatus);

    // Schedule 생성 로직 추가
    await this.createScheduleRecord(chauffeurId, changeStatusDto.updateStatus, previousStatus);

    const response = new ChauffeurStatusChangeResponseDto();
    response.chauffeurStatus = changeStatusDto.updateStatus;

    // 상태별 추가 로직 처리
    switch (changeStatusDto.updateStatus) {
      case ChauffeurStatus.RECEIVED_VEHICLE:
        // 차량 인수: 근무 시작
        try {
          if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
          await this.workHistoryService.startWork(chauffeurId, chauffeur.vehicleId || undefined);
        } catch (error) {
          console.error('근무 시작 기록 실패:', error);
          // 근무 기록 실패해도 상태 변경은 계속 진행
        }
        break;

      case ChauffeurStatus.OFF_DUTY:
        // 근무 종료: 근무 종료 기록만 처리 (상주/비상주는 차량 배정 해제하지 않음)
        try {
          if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
          await this.workHistoryService.endWork(chauffeurId);
        } catch (error) {
          console.error('근무 종료 기록 실패:', error);
          // 근무 기록 실패해도 전체 플로우는 계속 진행
        }
        // 상주/비상주 쇼퍼가 아닌 경우에만 차량 배정 해제
        if (chauffeur && chauffeur.type !== ChauffeurType.RESIDENT && chauffeur.type !== ChauffeurType.NON_RESIDENT) {
          await this.chauffeurServiceOutPort.update(chauffeurId, {
            vehicleId: null,
            isVehicleAssigned: false,
          });
        }
        break;

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
        // 운행 상태를 USED로 변경
        await this.updateCurrentOperationStatus(chauffeurId, DataStatus.USED);
        break;

      case ChauffeurStatus.WAITING_OPERATION:
        // 운행 중 -> 운행 대기: 안심 전화번호 반환
        await this.handleWaitingOperation(chauffeurId, response);
        break;

      case ChauffeurStatus.PENDING_RECEIPT_INPUT:
        // 운행 중 -> 정보 미기입: 영수증/추가비용 입력 대기 상태로 전환
        await this.handlePendingReceiptInput(chauffeurId, response);
        break;

      case ChauffeurStatus.OPERATION_COMPLETED:
        // 정보 미기입 -> 운행 종료: operation.endTime 설정 및 운행시간 계산 (operation update 완료 후)
        await this.handleOperationCompleted(chauffeurId, response);
        // 운행 상태를 COMPLETED로 변경
        await this.updateCurrentOperationStatus(chauffeurId, DataStatus.COMPLETED);
        break;
    }

    return response;
  }

  /**
   * Schedule 기록을 생성하는 메서드
   */
  private async createScheduleRecord(
    chauffeurId: number,
    newStatus: ChauffeurStatus,
    previousStatus: ChauffeurStatus | null,
  ): Promise<void> {
    try {
      // 출발지 이동시에도 Schedule을 생성함 (운행 진행 상태 추적을 위해)
      // if (newStatus === ChauffeurStatus.MOVING_TO_DEPARTURE) {
      //   console.log('출발지 이동 상태는 Schedule 생성을 건너뜁니다.');
      //   return;
      // }

      // Schedule 생성이 필요한 상태들만 처리 (wayPoint 진행상태 기록용)
      const scheduleTargetStatuses = [
        ChauffeurStatus.MOVING_TO_DEPARTURE, // 출발지 이동 (운행 시작)
        ChauffeurStatus.WAITING_FOR_PASSENGER, // 탑승 대기
        ChauffeurStatus.IN_OPERATION, // 운행 시작
        ChauffeurStatus.WAITING_OPERATION, // 운행 종료 (중간 경유지)
        ChauffeurStatus.OPERATION_COMPLETED, // 운행 종료 (최종 완료)
      ];

      if (!scheduleTargetStatuses.includes(newStatus)) {
        console.log(`${newStatus} 상태는 Schedule 생성 대상이 아닙니다.`);
        return;
      }

      // 현재 기사의 진행 중인 operation 조회
      const currentOperation = await this.getCurrentOperation(chauffeurId);

      if (!currentOperation) {
        console.log('진행 중인 운행이 없어서 Schedule 생성을 건너뜁니다.');
        return;
      }

      // 기사의 현재 위치 정보 조회
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      // 해당 상태에 맞는 wayPoint 찾기
      const relatedWayPointId = await this.findWayPointForSchedule(currentOperation.id, newStatus);

      if (!relatedWayPointId) {
        console.log(`${newStatus} 상태에 해당하는 wayPoint를 찾을 수 없습니다.`);
        // 출발지 이동의 경우 wayPoint가 없어도 Schedule 생성 (더미 wayPoint ID 사용)
        if (newStatus === ChauffeurStatus.MOVING_TO_DEPARTURE) {
          console.log('출발지 이동을 위한 더미 wayPoint로 Schedule 생성합니다.');
        } else {
          return;
        }
      }

      const createScheduleDto: CreateScheduleDto = {
        operationId: currentOperation.id,
        wayPointId: relatedWayPointId, // 출발지 이동의 경우 null 가능
        chauffeurStatus: newStatus,
      };

      await this.scheduleServiceInPort.create(createScheduleDto);
      console.log(`Schedule 생성 완료: ${chauffeurId} ${previousStatus} -> ${newStatus} (wayPoint: ${relatedWayPointId})`);
    } catch (error) {
      // Schedule 생성 실패해도 전체 플로우는 계속 진행
      console.error('Failed to create schedule record:', error);
    }
  }

  /**
   * 기사 상태에 따른 해당 wayPoint 찾기 (wayPoint 진행상태 기반)
   */
  private async findWayPointForSchedule(operationId: number, chauffeurStatus: ChauffeurStatus): Promise<number | null> {
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPointsResponse = await this.wayPointServiceInPort.search({ operationId }, wayPointPagination);
      const wayPoints = wayPointsResponse.data.sort((a, b) => a.order - b.order);

      if (wayPoints.length === 0) {
        return null;
      }

      switch (chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
          // 출발지 이동 → 출발지 (첫 번째 wayPoint)
          return wayPoints[0]?.id || null;

        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          // 탑승 대기 → 시작점 (첫 번째 wayPoint)
          return wayPoints[0]?.id || null;

        case ChauffeurStatus.IN_OPERATION:
          // 운행 중 → 현재 진행 중인 wayPoint
          // 아직 방문하지 않은 wayPoint 중 첫 번째를 찾음
          for (const wayPoint of wayPoints) {
            const wayPointDetail = await this.wayPointServiceOutPort.findById(wayPoint.id);
            if (wayPointDetail && !wayPointDetail.visitTime) {
              return wayPoint.id;
            }
          }
          // 모든 wayPoint가 방문되었다면 마지막 wayPoint
          return wayPoints[wayPoints.length - 1]?.id || null;

        case ChauffeurStatus.WAITING_OPERATION:
          // 운행 대기 → 방금 도착한 wayPoint (가장 최근에 방문한 wayPoint)
          // visitTime이 가장 최근인 wayPoint를 찾음
          let latestVisitedWayPoint = null;
          let latestVisitTime = null;

          for (const wayPoint of wayPoints) {
            const wayPointDetail = await this.wayPointServiceOutPort.findById(wayPoint.id);
            if (wayPointDetail && wayPointDetail.visitTime) {
              if (!latestVisitTime || wayPointDetail.visitTime > latestVisitTime) {
                latestVisitTime = wayPointDetail.visitTime;
                latestVisitedWayPoint = wayPoint;
              }
            }
          }

          if (latestVisitedWayPoint) {
            return latestVisitedWayPoint.id;
          }

          // 방문한 wayPoint가 없다면 현재 도착 예정인 다음 wayPoint
          for (const wayPoint of wayPoints) {
            const wayPointDetail = await this.wayPointServiceOutPort.findById(wayPoint.id);
            if (wayPointDetail && !wayPointDetail.visitTime) {
              return wayPoint.id;
            }
          }
          return null;

        case ChauffeurStatus.OPERATION_COMPLETED:
          // 운행 종료 → 마지막 도착지 (마지막 wayPoint)
          return wayPoints[wayPoints.length - 1]?.id || null;

        default:
          return null;
      }
    } catch (error) {
      console.error('Failed to find waypoint for schedule:', error);
      return null;
    }
  }

  // 기사 전용 메서드들
  async getMyProfile(chauffeurId: number): Promise<ChauffeurProfileResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    return plainToInstance(ChauffeurProfileResponseDto, chauffeur);
  }

  async getMyAssignedVehicle(chauffeurId: number): Promise<AssignedVehicleResponseDto | null> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

    if (!chauffeur.vehicleId) {
      return null;
    }

    const vehicle = await this.vehicleServiceOutPort.findById(chauffeur.vehicleId);

    // 차량이 없거나 삭제된 경우 null 반환
    if (!vehicle || vehicle.status === DataStatus.DELETED) {
      return null;
    }

    return plainToInstance(AssignedVehicleResponseDto, vehicle);
  }

  async getMyCurrentOperation(chauffeurId: number): Promise<CurrentOperationResponseDto | null> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);

    if (!currentOperation) {
      return null;
    }

    const response = plainToInstance(CurrentOperationResponseDto, currentOperation);

    // 예약 정보 조회 (일반 예약인 경우)
    if (currentOperation.type === OperationType.REGULAR) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.reservation = plainToInstance(CurrentReservationDto, reservation);
      } catch {
        // 예약 정보가 없는 경우
        response.reservation = null;
      }
    }

    // 실시간 배차 정보 조회 (실시간 배차인 경우)
    if (currentOperation.type === OperationType.REALTIME && currentOperation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(currentOperation.realTimeDispatchId);
        if (!realTimeDispatch) {
          response.departureAddress = null;
          response.destinationAddress = null;
          response.wayPoints = [];
          response.currentWayPoint = null;
          return response;
        }
        response.departureAddress = realTimeDispatch.departureAddress;
        response.destinationAddress = realTimeDispatch.destinationAddress;

        // 쇼퍼앱에서는 실시간 배차 정보를 간단하게 표시
        // 출발지, 도착지 정보를 waypoint 형태로 변환
        response.wayPoints = this.createSimpleWayPointsForChauffeur(realTimeDispatch);
        response.currentWayPoint = await this.getCurrentWayPointForRealTimeDispatch(chauffeurId, realTimeDispatch);
      } catch (error) {
        // 실시간 배차 정보가 없는 경우
        response.departureAddress = null;
        response.destinationAddress = null;
        response.wayPoints = [];
        response.currentWayPoint = null;
      }
    } else {
      // 일반 예약인 경우 기존 로직 유지
      // 경유지 정보 조회 (운행에서 직접 조회)
      try {
        const wayPointPagination = new PaginationQuery();
        wayPointPagination.page = 1;
        wayPointPagination.countPerPage = 100;

        const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);
        const sortedWayPoints = wayPoints.data.sort((a, b) => a.order - b.order);

        response.wayPoints = sortedWayPoints.map((wp) => plainToInstance(CurrentWayPointDto, wp));

        // 현재 진행 중인 waypoint 식별
        response.currentWayPoint = await this.getCurrentWayPoint(chauffeurId, sortedWayPoints);
      } catch {
        response.wayPoints = [];
        response.currentWayPoint = null;
      }
    }

    return response;
  }

  async getMyNearestReservation(chauffeurId: number): Promise<NearestReservationResponseDto | null> {
    // 기사에게 할당된 모든 운행 조회
    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 100;

    const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

    if (operations.length === 0) {
      return null;
    }

    const currentTime = new Date();

    // 미래 또는 진행 중인 운행들만 필터링 (endTime 기준)
    const futureOperations = operations.filter((op) => {
      // 삭제되거나 완료된 운행 제외
      if (op.status === DataStatus.DELETED || op.status === DataStatus.COMPLETED) {
        return false;
      }

      // startTime이 있는 경우: 진행 중이거나 미래 운행만 포함
      if (op.startTime) {
        // 아직 시작하지 않은 미래 운행이거나,
        // 진행 중인 운행(endTime이 현재 시간 이후)인 경우 포함
        return op.startTime > currentTime || !op.endTime || op.endTime > currentTime;
      }

      // startTime이 없는 경우: 아직 시작하지 않은 예약으로 간주
      return true;
    });

    if (futureOperations.length === 0) {
      return null;
    }

    // 시작 시간 기준으로 정렬 (가장 빠른 것이 첫 번째)
    const sortedOperations = futureOperations.sort((a, b) => {
      // startTime이 있는 것을 우선
      if (a.startTime && b.startTime) {
        return a.startTime.getTime() - b.startTime.getTime();
      }
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;

      // 둘 다 startTime이 없으면 생성일 기준
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const nearestOperation = sortedOperations[0];

    // 응답 DTO 구성
    const response = new NearestReservationResponseDto();

    // Operation 정보
    response.operation = plainToInstance(NextOperationDto, {
      id: nearestOperation.id,
      type: nearestOperation.type,
      startTime: nearestOperation.startTime,
      endTime: nearestOperation.endTime,
      minutesUntilStart: nearestOperation.startTime
        ? Math.floor((nearestOperation.startTime.getTime() - currentTime.getTime()) / (1000 * 60))
        : null,
    });

    // 예약 정보 조회 (모든 운행 타입에 대해 조회 시도)
    try {
      const reservationPagination = new PaginationQuery();
      reservationPagination.page = 1;
      reservationPagination.countPerPage = 1;

      const reservations = await this.reservationServiceInPort.search(
        { operationId: nearestOperation.id },
        reservationPagination,
      );

      if (reservations.data.length > 0) {
        response.reservation = plainToInstance(NextReservationDto, reservations.data[0]);
      } else {
        response.reservation = null;
      }
    } catch {
      response.reservation = null;
    }

    // 경유지 정보 조회
    try {
      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: nearestOperation.id }, wayPointPagination);
      response.wayPoints = wayPoints.data.sort((a, b) => a.order - b.order).map((wp) => plainToInstance(NextWayPointDto, wp));
    } catch {
      response.wayPoints = [];
    }

    // 실시간 배차 정보 조회 (실시간 배차인 경우)
    if (nearestOperation.type === OperationType.REALTIME && nearestOperation.realTimeDispatchId) {
      try {
        const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(nearestOperation.realTimeDispatchId);
        if (!realTimeDispatch) throw new Error('실시간 배차 정보를 찾을 수 없습니다.');
        response.departureAddress = realTimeDispatch.departureAddress;
        response.destinationAddress = realTimeDispatch.destinationAddress;
      } catch {
        response.departureAddress = null;
        response.destinationAddress = null;
      }
    } else {
      response.departureAddress = null;
      response.destinationAddress = null;
    }

    return response;
  }

  private async handleMovingToDeparture(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      await this.operationServiceOutPort.update(currentOperation.id, {
        startTime: new Date(),
      });

      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleWaitingForPassenger(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleInOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
      } catch {
        // 예약 정보가 없는 경우 - 계속 진행
      }

      const wayPointPagination = new PaginationQuery();
      wayPointPagination.page = 1;
      wayPointPagination.countPerPage = 100;

      const wayPoints = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);

      response.hasWayPoints = wayPoints.data.length > 0;

      if (wayPoints.data.length > 0) {
        response.wayPoints = wayPoints.data.sort((a, b) => a.order - b.order).map((wp) => plainToInstance(WayPointInfo, wp));
      }
    }
  }

  private async handleWaitingOperation(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation) {
      try {
        const reservation = await this.reservationServiceInPort.detail(currentOperation.id);
        response.safetyPhone = reservation.safetyPhone ?? undefined;
      } catch {
        // 예약 정보가 없는 경우
        response.safetyPhone = undefined;
      }
    }
  }

  private async handleOperationCompleted(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation && currentOperation.startTime) {
      // PENDING_RECEIPT_INPUT에서 OPERATION_COMPLETED로 전환되는 경우 이미 endTime이 설정되어 있을 수 있음
      let endTime: Date;
      let shouldUpdateEndTime = false;

      if (currentOperation.endTime) {
        // 이미 endTime이 있는 경우 (PENDING_RECEIPT_INPUT -> OPERATION_COMPLETED)
        endTime = new Date(currentOperation.endTime);
        console.log('기존 endTime 사용:', endTime.toISOString());
      } else {
        // endTime이 없는 경우 새로 설정
        endTime = new Date();
        shouldUpdateEndTime = true;
        console.log('새로운 endTime 설정:', endTime.toISOString());
      }

      if (shouldUpdateEndTime) {
        await this.operationServiceOutPort.update(currentOperation.id, {
          endTime,
        });
      }

      // 운행 시간 계산 (시작 시간부터 종료 시간까지)
      const startTime = new Date(currentOperation.startTime);
      const operationTimeMs = endTime.getTime() - startTime.getTime();

      // 음수 방지 및 정확한 분 단위 계산
      const operationTimeMinutes = Math.max(0, Math.round(operationTimeMs / (1000 * 60)));
      response.operationTimeMinutes = operationTimeMinutes;

      console.log(
        `운행 완료 시간 계산: 시작(${startTime.toISOString()}) -> 종료(${endTime.toISOString()}) = ${operationTimeMinutes}분`,
      );
    }
  }

  private async handlePendingReceiptInput(chauffeurId: number, response: ChauffeurStatusChangeResponseDto): Promise<void> {
    // 운행 중에서 정보 미기입 상태로 전환 시 endTime 설정
    const currentOperation = await this.getCurrentOperation(chauffeurId);
    if (currentOperation && currentOperation.startTime) {
      const endTime = new Date();
      await this.operationServiceOutPort.update(currentOperation.id, {
        endTime,
      });

      // 운행 시간 계산 (시작 시간부터 종료 시간까지)
      const startTime = new Date(currentOperation.startTime);
      const operationTimeMs = endTime.getTime() - startTime.getTime();

      // 음수 방지 및 정확한 분 단위 계산
      const operationTimeMinutes = Math.max(0, Math.round(operationTimeMs / (1000 * 60)));
      response.operationTimeMinutes = operationTimeMinutes;

      console.log(
        `운행 시간 계산: 시작(${startTime.toISOString()}) -> 종료(${endTime.toISOString()}) = ${operationTimeMinutes}분`,
      );
    }

    // 이 상태에서는 클라이언트가 영수증 및 추가비용 정보를 입력할 수 있음
    // operation update API 호출 시 자동으로 OPERATION_COMPLETED 상태로 전환됨
  }

  private async getCurrentOperation(chauffeurId: number) {
    console.log(`getCurrentOperation 호출: chauffeurId=${chauffeurId}`);

    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 10; // 충분한 수의 운행을 조회

    const [operations, totalCount] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);
    console.log(`조회된 운행 수: ${totalCount}`);

    if (totalCount > 0) {
      const currentTime = new Date();

      // 기사의 현재 상태 확인
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
      console.log(`기사 상태: ${chauffeur?.chauffeurStatus}`);

      // 예약 대기 중인 경우는 현재 운행으로 반환하지 않음
      if (chauffeur && chauffeur.chauffeurStatus === ChauffeurStatus.WAITING_FOR_RESERVATION) {
        console.log('예약 대기 중 상태로 인해 null 반환');
        return null;
      }

      console.log('=== 모든 운행 조회 ===');
      operations.forEach((op, index) => {
        console.log(
          `운행 ${index}: id=${op.id}, status=${op.status}, startTime=${op.startTime}, endTime=${op.endTime}, chauffeurId=${op.chauffeurId}`,
        );
      });

      // 현재 진행 중인 운행: 삭제되지 않고, 완료되지 않은 운행
      const currentOperations = operations.filter((op) => {
        console.log(`=== 운행 ${op.id} 필터링 검사 ===`);

        // 삭제되거나 완료된 운행 제외
        if (op.status === DataStatus.DELETED || op.status === DataStatus.COMPLETED) {
          console.log(`운행 ${op.id}: status(${op.status})로 인해 제외`);
          return false;
        }

        // PENDING_RECEIPT_INPUT 상태인 경우 특별 처리
        if (chauffeur && chauffeur.chauffeurStatus === ChauffeurStatus.PENDING_RECEIPT_INPUT) {
          console.log(`운행 ${op.id}: PENDING_RECEIPT_INPUT 상태 특별 처리`);

          // PENDING_RECEIPT_INPUT 상태에서는 endTime이 있는 운행만 현재 운행으로 간주
          if (op.endTime) {
            console.log(`운행 ${op.id}: PENDING_RECEIPT_INPUT 상태에서 endTime 존재하므로 현재 운행으로 포함`);
            return true;
          } else {
            console.log(`운행 ${op.id}: PENDING_RECEIPT_INPUT 상태이지만 endTime이 없으므로 제외`);
            return false;
          }
        } else {
          // 다른 상태에서는 기존 로직 적용: endTime이 있고 현재 시간보다 이전이면 제외
          if (op.endTime && op.endTime <= currentTime) {
            console.log(`운행 ${op.id}: endTime(${op.endTime})이 현재시각(${currentTime}) 이전이므로 제외`);
            return false;
          }
        }

        // startTime이 있고 현재 시간보다 너무 이전이면 제외 (24시간 이전)
        if (op.startTime && op.startTime < new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)) {
          console.log(`운행 ${op.id}: startTime(${op.startTime})이 24시간 이전이므로 제외`);
          return false;
        }

        console.log(`운행 ${op.id}: 모든 조건 통과, 현재 운행으로 포함`);
        return true;
      });

      console.log(`=== 필터링 결과: ${currentOperations.length}개 운행 ===`);
      currentOperations.forEach((op, index) => {
        console.log(`필터링된 운행 ${index}: id=${op.id}, status=${op.status}, startTime=${op.startTime}, endTime=${op.endTime}`);
      });

      if (currentOperations.length > 0) {
        // 시작 시간이 있는 것 우선, 그 다음 최신 순
        currentOperations.sort((a, b) => {
          if (a.startTime && b.startTime) {
            return b.startTime.getTime() - a.startTime.getTime();
          }
          if (a.startTime && !b.startTime) return -1;
          if (!a.startTime && b.startTime) return 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        console.log(`최종 선택된 현재 운행: id=${currentOperations[0].id}`);
        return currentOperations[0];
      }
    }

    console.log('현재 운행 없음: null 반환');
    return null;
  }

  /**
   * 현재 진행 중인 waypoint를 식별하는 메서드
   */
  private async getCurrentWayPoint(chauffeurId: number, sortedWayPoints: any[]): Promise<CurrentWayPointDto | null> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur || sortedWayPoints.length === 0) {
        return null;
      }

      // "출발지 이동" 상태 이후에만 currentWayPoint 반환
      if (chauffeur.chauffeurStatus === ChauffeurStatus.WAITING_FOR_RESERVATION) {
        return null; // 예약 대기 중에는 currentWayPoint 반환하지 않음
      }

      switch (chauffeur.chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
          // 출발지로 이동 중이거나 고객 탑승 대기 중 → 첫 번째 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[0]);

        case ChauffeurStatus.IN_OPERATION:
          // 운행 중 → 다음 목적지 waypoint (아직 방문하지 않은 waypoint 중 첫 번째)
          // chauffeurStatus가 없거나 visitTime이 없으면 아직 방문하지 않은 waypoint로 판정
          const nextWayPoint = sortedWayPoints.find((wp: any) => !wp.chauffeurStatus || !wp.visitTime);
          if (nextWayPoint) {
            return plainToInstance(CurrentWayPointDto, nextWayPoint);
          }
          // 모든 waypoint를 방문했다면 마지막 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[sortedWayPoints.length - 1]);

        case ChauffeurStatus.WAITING_OPERATION:
          // 운행 대기 → 현재 위치한 waypoint (가장 최근에 방문한 waypoint)
          // chauffeurStatus가 있고 visitTime이 있는 waypoint들만 필터링
          const visitedWayPoints = sortedWayPoints.filter((wp: any) => wp.chauffeurStatus && wp.visitTime);
          if (visitedWayPoints.length > 0) {
            // visitTime 기준으로 가장 최근 방문한 waypoint (실제 방문 시간이 기록된 것 우선)
            const latestVisited = visitedWayPoints.sort((a: any, b: any) => {
              // visitTime이 있는 것을 우선으로, 그 다음 최신순
              if (a.visitTime && b.visitTime) {
                return new Date(b.visitTime).getTime() - new Date(a.visitTime).getTime();
              }
              if (a.visitTime && !b.visitTime) return -1;
              if (!a.visitTime && b.visitTime) return 1;
              return b.order - a.order; // visitTime이 둘 다 없으면 order 역순
            })[0];
            return plainToInstance(CurrentWayPointDto, latestVisited);
          }
          // 방문한 waypoint가 없다면 첫 번째 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[0]);

        case ChauffeurStatus.OPERATION_COMPLETED:
          // 운행 완료 → 마지막 waypoint
          return plainToInstance(CurrentWayPointDto, sortedWayPoints[sortedWayPoints.length - 1]);

        default:
          // 기타 상태 → null
          return null;
      }
    } catch (error) {
      console.error('Failed to get current waypoint:', error);
      return null;
    }
  }

  /**
   * 기사 상태 변경 시 현재 위치의 waypoint에 기사 상태를 저장하는 메서드
   */
  private async checkVehicleAssignmentConflict(vehicleId: number, excludeChauffeurId?: number): Promise<void> {
    const assignedChauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicleId);
    const conflictingChauffeurs = assignedChauffeurs.filter((c) => c.id !== excludeChauffeurId && c.isVehicleAssigned);

    if (conflictingChauffeurs.length > 0) {
      throw new Error(`차량 ID ${vehicleId}는 이미 다른 기사에게 배정되어 있습니다.`);
    }
  }

  private async unassignVehicleFromChauffeur(chauffeurId: number): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur || !chauffeur.vehicleId) return;

    const vehicleId = chauffeur.vehicleId;

    // 현재 기사의 배정 해제
    await this.chauffeurServiceOutPort.update(chauffeurId, {
      vehicleId: null,
      isVehicleAssigned: false,
    });

    // 해당 차량에 배정된 다른 기사들의 상태도 확인하여 중복 배정 정리
    const assignedChauffeurs = await this.chauffeurServiceOutPort.findByVehicleId(vehicleId);
    for (const otherChauffeur of assignedChauffeurs) {
      if (otherChauffeur.id !== chauffeurId && otherChauffeur.isVehicleAssigned) {
        console.warn(`차량 ID ${vehicleId}에 중복 배정된 기사 발견: ${otherChauffeur.id}`);
        // 중복 배정된 기사도 배정 해제
        await this.chauffeurServiceOutPort.update(otherChauffeur.id, {
          vehicleId: null,
          isVehicleAssigned: false,
        });
      }
    }
  }

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

      const wayPointsResponse = await this.wayPointServiceInPort.search({ operationId: currentOperation.id }, wayPointPagination);

      // 실시간 배차인데 WayPoint가 없는 경우 자동 생성
      if (
        wayPointsResponse.data.length === 0 &&
        currentOperation.type === OperationType.REALTIME &&
        currentOperation.realTimeDispatchId
      ) {
        await this.createMissingRealTimeDispatchWayPoints(currentOperation.id, currentOperation.realTimeDispatchId);

        // 다시 조회
        const updatedWayPointsResponse = await this.wayPointServiceInPort.search(
          { operationId: currentOperation.id },
          wayPointPagination,
        );
        wayPointsResponse.data = updatedWayPointsResponse.data;
      }

      if (wayPointsResponse.data.length === 0) {
        return; // waypoint가 없으면 업데이트 불필요
      }

      // waypoint들을 order 순으로 정렬
      const wayPoints = wayPointsResponse.data.sort((a, b) => a.order - b.order);

      // 기사 상태에 따른 현재 위치 waypoint 찾기
      let targetWayPointId: number | null = null;

      switch (chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
          // 출발지 이동 - 첫 번째 waypoint (order=1)
          const firstWayPointForMoving = wayPoints.find((wp) => wp.order === 1);
          if (firstWayPointForMoving) {
            targetWayPointId = firstWayPointForMoving.id;
          }
          break;

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

        case ChauffeurStatus.PENDING_RECEIPT_INPUT:
          // 정보 미기입 - 마지막 wayPoint (운행 완료 후 정보만 미기입인 상태)
          const lastWayPointForReceipt = wayPoints[wayPoints.length - 1];
          if (lastWayPointForReceipt) {
            targetWayPointId = lastWayPointForReceipt.id;
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
          visitTime: new Date(), // 방문 시간 기록
        });
      }
    } catch (error) {
      // waypoint 업데이트 실패 시 로그만 남기고 전체 플로우는 계속 진행
      console.error('Failed to update waypoint chauffeur status:', error);
    }
  }

  /**
   * 실시간 배차를 위한 WayPoint 자동 생성 (편도 기본)
   * @param operationId 운행 ID
   * @param realTimeDispatchId 실시간 배차 ID
   * @param isRoundTrip 왕복 여부 (기본값: false)
   */
  private async createMissingRealTimeDispatchWayPoints(
    operationId: number,
    realTimeDispatchId: number,
    isRoundTrip: boolean = false,
  ): Promise<void> {
    try {
      // 실시간 배차 정보 조회
      const realTimeDispatch = await this.realTimeDispatchServiceOutPort.findById(realTimeDispatchId);
      if (!realTimeDispatch) throw new Error('실시간 배차 정보를 찾을 수 없습니다.');

      // 1. 출발지 WayPoint 생성 (order=1)
      await this.wayPointServiceInPort.create({
        operationId: operationId,
        name: realTimeDispatch.departureName,
        address: realTimeDispatch.departureAddress,
        addressDetail: realTimeDispatch.departureAddressDetail,
        order: 1,
      });

      // 2. 왕복인 경우 목적지 WayPoint 생성 (order=2)
      if (isRoundTrip) {
        await this.wayPointServiceInPort.create({
          operationId: operationId,
          name: realTimeDispatch.destinationName,
          address: realTimeDispatch.destinationAddress,
          addressDetail: realTimeDispatch.destinationAddressDetail,
          order: 2,
        });
      }
    } catch (error) {
      console.error('Failed to create missing real-time dispatch waypoints:', error);
      // 에러가 발생해도 전체 플로우를 중단하지 않음
    }
  }

  /**
   * 기존 실시간 배차 Operation들에 대해 WayPoint를 일괄 생성
   * @param isRoundTrip 왕복 여부 (기본값: false - 편도)
   */
  async createWayPointsForExistingRealTimeDispatches(isRoundTrip: boolean = false): Promise<void> {
    try {
      // 실시간 배차 타입의 Operation들을 조회
      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 1000; // 충분한 수로 설정

      const [operations] = await this.operationServiceOutPort.findAll({ type: OperationType.REALTIME }, operationPagination);

      for (const operation of operations) {
        if (operation.realTimeDispatchId) {
          // 이미 WayPoint가 있는지 확인
          const wayPointPagination = new PaginationQuery();
          wayPointPagination.page = 1;
          wayPointPagination.countPerPage = 10;

          const wayPoints = await this.wayPointServiceInPort.search({ operationId: operation.id }, wayPointPagination);

          // WayPoint가 없으면 생성
          if (wayPoints.data.length === 0) {
            await this.createMissingRealTimeDispatchWayPoints(operation.id, operation.realTimeDispatchId, isRoundTrip);
          }
        }
      }
    } catch (error) {
      console.error('Failed to create waypoints for existing real-time dispatches:', error);
    }
  }

  // 위치 관련 메서드들
  async updateMyLocation(chauffeurId: number, updateLocationDto: UpdateLocationDto): Promise<void> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
    await this.chauffeurServiceOutPort.updateLocation(chauffeurId, updateLocationDto.latitude, updateLocationDto.longitude);
  }

  async getMyLocation(chauffeurId: number): Promise<LocationResponseDto> {
    const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
    if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');
    return plainToInstance(LocationResponseDto, {
      latitude: chauffeur.latitude,
      longitude: chauffeur.longitude,
    });
  }

  /**
   * 행사 쇼퍼의 오늘 배차 상태를 확인하고 필요시 차량 배정 해제
   */
  async checkAndUpdateEventChauffeurStatus(chauffeurId: number): Promise<void> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 행사 쇼퍼가 아니면 처리하지 않음
      if (chauffeur.type !== ChauffeurType.EVENT) {
        return;
      }

      // 오늘 날짜의 배차(운행) 확인
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const operationPagination = new PaginationQuery();
      operationPagination.page = 1;
      operationPagination.countPerPage = 100;

      const [operations] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);

      // 오늘 날짜에 해당하는 운행이 있는지 확인
      const todayOperations = operations.filter((op) => {
        if (!op.startTime) return false;
        const opDate = new Date(op.startTime);
        return opDate >= todayStart && opDate <= todayEnd;
      });

      // 오늘 배차가 없으면 차량 배정 해제
      if (todayOperations.length === 0) {
        await this.chauffeurServiceOutPort.update(chauffeurId, {
          isVehicleAssigned: false,
          vehicleId: null, // 차량 배정도 해제
        });
      }
    } catch (error) {
      console.error('Failed to check event chauffeur status:', error);
    }
  }

  /**
   * 기사 타입별 배차 가능 여부 확인
   */
  async canAssignVehicle(chauffeurId: number): Promise<boolean> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 차량이 이미 배정되어 있으면 배차 불가능
      if (chauffeur.isVehicleAssigned) {
        return false;
      }

      // 기사 타입이 없으면 배차 불가능
      if (!chauffeur.type) {
        return false;
      }

      switch (chauffeur.type) {
        case ChauffeurType.RESIDENT:
        case ChauffeurType.NON_RESIDENT:
          // 상주, 비상주는 배차 가능 (근무 종료 상태일 때)
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        case ChauffeurType.EVENT:
          // 행사는 예약과 함께만 배차 가능
          return false;

        case ChauffeurType.HOSPITAL:
          // 병원은 기존 로직 유지 (배차 가능)
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to check vehicle assignment eligibility:', error);
      return false;
    }
  }

  /**
   * 기사 타입별 차량 변경 가능 여부 확인
   */
  async canChangeVehicle(chauffeurId: number): Promise<boolean> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) throw new Error('기사를 찾을 수 없습니다.');

      // 차량이 배정되어 있지 않으면 차량 변경 불가능
      if (!chauffeur.isVehicleAssigned) {
        return false;
      }

      // 기사 타입이 없으면 차량 변경 불가능
      if (!chauffeur.type) {
        return false;
      }

      switch (chauffeur.type) {
        case ChauffeurType.RESIDENT:
        case ChauffeurType.NON_RESIDENT:
          // 상주, 비상주는 근무 종료 상태에서 차량 변경 가능
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        case ChauffeurType.EVENT:
          // 행사는 차량 변경 불가능 (예약과 함께만 배차)
          return false;

        case ChauffeurType.HOSPITAL:
          // 병원은 근무 종료 상태에서 차량 변경 가능
          return chauffeur.chauffeurStatus === ChauffeurStatus.OFF_DUTY;

        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to check vehicle change eligibility:', error);
      return false;
    }
  }

  /**
   * 현재 운행의 DataStatus를 업데이트하는 메서드
   */
  private async updateCurrentOperationStatus(chauffeurId: number, status: DataStatus): Promise<void> {
    try {
      console.log(`=== updateCurrentOperationStatus ===`);
      console.log(`ChauffeurId: ${chauffeurId}, Target Status: ${status}`);

      const targetOperation = await this.getOperationForStatusUpdate(chauffeurId);
      console.log(`Target Operation Found:`, !!targetOperation);
      console.log(`Target Operation ID:`, targetOperation?.id);
      console.log(`Target Operation Current Status:`, targetOperation?.status);

      if (targetOperation) {
        console.log(`Updating operation ${targetOperation.id} to status ${status}`);
        await this.operationServiceOutPort.update(targetOperation.id, {
          status: status,
        });
        console.log(`Operation status update completed`);
      } else {
        console.error(`No target operation found for chauffeur ${chauffeurId}`);
      }
    } catch (error) {
      console.error('Failed to update operation status:', error);
    }
  }

  /**
   * 운행 상태 업데이트를 위한 operation 조회
   * getCurrentOperation과 달리 endTime이 있어도 최근 운행을 찾을 수 있음
   */
  private async getOperationForStatusUpdate(chauffeurId: number) {
    console.log(`=== getOperationForStatusUpdate ===`);
    console.log(`Looking for operations for chauffeur: ${chauffeurId}`);

    const operationPagination = new PaginationQuery();
    operationPagination.page = 1;
    operationPagination.countPerPage = 10;

    const [operations, totalCount] = await this.operationServiceOutPort.findAll({ chauffeurId }, operationPagination);
    console.log(`Total operations found: ${totalCount}`);

    if (totalCount > 0) {
      console.log(
        `All operations:`,
        operations.map((op) => ({ id: op.id, status: op.status, startTime: op.startTime, endTime: op.endTime })),
      );

      // 삭제되지 않고 완료되지 않은 운행 중에서 가장 최근 운행 찾기
      const targetOperations = operations.filter((op) => {
        console.log(
          `Checking operation ${op.id}: status=${op.status}, deleted=${op.status === DataStatus.DELETED}, completed=${op.status === DataStatus.COMPLETED}`,
        );

        // 삭제되거나 이미 완료된 운행 제외
        if (op.status === DataStatus.DELETED || op.status === DataStatus.COMPLETED) {
          console.log(`Excluding operation ${op.id} due to status: ${op.status}`);
          return false;
        }
        return true;
      });

      console.log(`Filtered operations count: ${targetOperations.length}`);
      console.log(
        `Filtered operations:`,
        targetOperations.map((op) => ({ id: op.id, status: op.status })),
      );

      if (targetOperations.length > 0) {
        // 최신 생성 순으로 정렬하여 가장 최근 운행 반환
        targetOperations.sort((a, b) => {
          // startTime이 있는 것 우선, 그 다음 최신 순
          if (a.startTime && b.startTime) {
            return b.startTime.getTime() - a.startTime.getTime();
          }
          if (a.startTime && !b.startTime) return -1;
          if (!a.startTime && b.startTime) return 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        console.log(`Selected operation for status update: ${targetOperations[0].id}`);
        return targetOperations[0];
      }
    }

    console.log(`No suitable operation found for status update`);
    return null;
  }

  /**
   * 실시간 배차 정보를 쇼퍼앱용 간단한 waypoint 형태로 변환
   */
  private createSimpleWayPointsForChauffeur(realTimeDispatch: any): CurrentWayPointDto[] {
    const wayPoints: CurrentWayPointDto[] = [];

    // 1. 출발지 (항상 표시)
    wayPoints.push(
      plainToInstance(CurrentWayPointDto, {
        id: 0, // 임시 ID
        name: (realTimeDispatch as any).departureName,
        address: (realTimeDispatch as any).departureAddress,
        addressDetail: (realTimeDispatch as any).departureAddressDetail,
        order: 1,
        visitTime: null,
        chauffeurStatus: null,
      }),
    );

    // 2. 도착지 (항상 표시)
    wayPoints.push(
      plainToInstance(CurrentWayPointDto, {
        id: 0, // 임시 ID
        name: (realTimeDispatch as any).destinationName,
        address: (realTimeDispatch as any).destinationAddress,
        addressDetail: (realTimeDispatch as any).destinationAddressDetail,
        order: 2,
        visitTime: null,
        chauffeurStatus: null,
      }),
    );

    return wayPoints;
  }

  /**
   * 실시간 배차에서 현재 진행 중인 waypoint 정보 반환
   */
  private async getCurrentWayPointForRealTimeDispatch(
    chauffeurId: number,
    realTimeDispatch: any,
  ): Promise<CurrentWayPointDto | null> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);

      if (!chauffeur) {
        return null;
      }

      switch (chauffeur.chauffeurStatus) {
        case ChauffeurStatus.MOVING_TO_DEPARTURE:
        case ChauffeurStatus.WAITING_FOR_PASSENGER:
        case ChauffeurStatus.IN_OPERATION:
          // 출발지 정보 반환
          return plainToInstance(CurrentWayPointDto, {
            id: 0, // 임시 ID
            name: (realTimeDispatch as any).departureName,
            address: (realTimeDispatch as any).departureAddress,
            addressDetail: (realTimeDispatch as any).departureAddressDetail,
            order: 1,
            visitTime: null,
            chauffeurStatus: chauffeur.chauffeurStatus,
          });

        case ChauffeurStatus.WAITING_OPERATION:
        case ChauffeurStatus.OPERATION_COMPLETED:
          // 도착지 정보 반환
          return plainToInstance(CurrentWayPointDto, {
            id: 0, // 임시 ID
            name: (realTimeDispatch as any).destinationName,
            address: (realTimeDispatch as any).destinationAddress,
            addressDetail: (realTimeDispatch as any).destinationAddressDetail,
            order: 2,
            visitTime: null,
            chauffeurStatus: chauffeur.chauffeurStatus,
          });

        default:
          return null;
      }
    } catch (error) {
      console.error('Failed to get current waypoint for real-time dispatch:', error);
      return null;
    }
  }

  /**
   * FCM 토큰 업데이트
   */
  async updateFCMToken(chauffeurId: number, fcmToken: string): Promise<void> {
    try {
      await this.chauffeurServiceOutPort.update(chauffeurId, {
        fcmToken,
      });
      console.log(`기사 ID ${chauffeurId}의 FCM 토큰이 업데이트되었습니다.`);
    } catch (error) {
      console.error('FCM 토큰 업데이트 실패:', error);
      throw new Error('FCM 토큰 업데이트에 실패했습니다.');
    }
  }
}
