import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { PaginationResponse } from '@/adapter/inbound/dto/common/pagination.dto';
import { Pagination, PaginationQuery } from '@/adapter/inbound/dto/pagination';
import { AssignChauffeurDto } from '@/adapter/inbound/dto/request/admin/assign-chauffeur.dto';
import { CreateOperationDto } from '@/adapter/inbound/dto/request/operation/create-operation.dto';
import { SearchOperationDto } from '@/adapter/inbound/dto/request/operation/search-operation.dto';
import { UpdateOperationDto } from '@/adapter/inbound/dto/request/operation/update-operation.dto';
import { AssignChauffeurResponseDto } from '@/adapter/inbound/dto/response/admin/assign-chauffeur-response.dto';
import { OperationResponseDto } from '@/adapter/inbound/dto/response/operation/operation-response.dto';
import { Operation } from '@/domain/entity/operation.entity';
import { Reservation } from '@/domain/entity/reservation.entity';
import { WayPoint } from '@/domain/entity/way-point.entity';
import { ChauffeurStatus } from '@/domain/enum/chauffeur-status.enum';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { OperationType } from '@/domain/enum/operation-type.enum';
import { OperationServiceInPort } from '@/port/inbound/operation-service.in-port';
import { ReservationServiceInPort } from '@/port/inbound/reservation-service.in-port';
import { WayPointServiceInPort } from '@/port/inbound/way-point-service.in-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';
import { classTransformDefaultOptions } from '@/validate/serialization';

@Injectable()
export class OperationService implements OperationServiceInPort {
  constructor(
    private readonly operationServiceOutPort: OperationServiceOutPort,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly reservationServiceInPort: ReservationServiceInPort,
    private readonly wayPointServiceInPort: WayPointServiceInPort,
  ) {}

  async search(
    searchOperation: SearchOperationDto,
    paginationQuery: PaginationQuery,
  ): Promise<PaginationResponse<OperationResponseDto>> {
    const [operations, totalCount] = await this.operationServiceOutPort.findAll(searchOperation, paginationQuery);
    const pagination = new Pagination({ totalCount, paginationQuery });

    const response = plainToInstance(OperationResponseDto, operations, classTransformDefaultOptions);

    return new PaginationResponse(response, pagination);
  }

  async detail(id: number): Promise<OperationResponseDto> {
    return await this.operationServiceOutPort.findByIdWithDetails(id);
  }

  async create(createOperation: CreateOperationDto): Promise<void> {
    // 1. Operation 엔티티 생성
    const operation = plainToInstance(Operation, {
      type: createOperation.type,
      isRepeated: createOperation.schedule.isRepeat || false,
      chauffeurId: createOperation.chauffeurId,
      vehicleId: createOperation.vehicleId,
      realTimeDispatchId: createOperation.schedule.realTimeDispatchId,
      status: DataStatus.REGISTER,
    });

    // 2. Operation 저장
    await this.operationServiceOutPort.save(operation);

    // 3. Reservation 생성 및 저장
    await this.reservationServiceInPort.create({
      operationId: operation.id,
      passengerName: createOperation.reservation.passengerName,
      passengerPhone: createOperation.reservation.passengerPhone,
      passengerEmail: createOperation.reservation.passengerEmail,
      passengerCount: createOperation.reservation.passengerCount,
      memo: createOperation.memo,
    });

    // 4. WayPoints 생성 및 저장
    for (const wayPointInfo of createOperation.schedule.wayPoints) {
      await this.wayPointServiceInPort.create({
        operationId: operation.id,
        address: wayPointInfo.address,
        addressDetail: wayPointInfo.addressDetail,
        latitude: wayPointInfo.latitude,
        longitude: wayPointInfo.longitude,
        order: wayPointInfo.order,
      });
    }

    // 5. 실시간 배차인 경우 담당자 정보 저장
    if (createOperation.manager && createOperation.type === OperationType.REALTIME) {
      // 담당자 정보를 operation의 추가 정보로 저장
      const managerInfo = {
        managerName: createOperation.manager.managerName,
        managerNumber: createOperation.manager.managerNumber,
      };

      await this.operationServiceOutPort.update(operation.id, {
        additionalCosts: managerInfo as any, // 임시로 additionalCosts 필드 활용
      });
    }
  }

  async update(id: number, updateOperation: UpdateOperationDto): Promise<void> {
    // 1. Operation 업데이트 실행
    await this.operationServiceOutPort.update(id, updateOperation);

    // 2. 영수증이나 추가비용이 업데이트되었는지 확인
    const hasReceiptUpdate = updateOperation.receiptImageUrls && updateOperation.receiptImageUrls.length > 0;
    const hasAdditionalCostsUpdate = updateOperation.additionalCosts && Object.keys(updateOperation.additionalCosts).length > 0;

    // 3. 영수증이나 추가비용이 업데이트된 경우, 기사 상태 확인 및 변경
    if (hasReceiptUpdate || hasAdditionalCostsUpdate) {
      const operation = await this.operationServiceOutPort.findById(id);

      if (operation.chauffeurId) {
        const chauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);

        // 기사가 정보 미기입 상태인 경우 운행 완료 상태로 변경
        if (chauffeur.chauffeurStatus === ChauffeurStatus.PENDING_RECEIPT_INPUT) {
          await this.chauffeurServiceOutPort.update(operation.chauffeurId, {
            chauffeurStatus: ChauffeurStatus.OPERATION_COMPLETED,
          });
        }
      }
    }
  }

  async delete(id: number): Promise<void> {
    await this.operationServiceOutPort.updateStatus(id, DataStatus.DELETED);
  }

  async assignChauffeur(assignDto: AssignChauffeurDto): Promise<AssignChauffeurResponseDto> {
    // 1. 운행 정보 조회
    const operation = await this.operationServiceOutPort.findById(assignDto.operationId);

    // 2. 새로 배정할 기사 정보 조회
    const newChauffeur = await this.chauffeurServiceOutPort.findById(assignDto.chauffeurId);

    // 3. 이전 기사 정보 저장 (있다면)
    let previousChauffeur = null;
    if (operation.chauffeurId) {
      previousChauffeur = await this.chauffeurServiceOutPort.findById(operation.chauffeurId);
    }

    // 4. 운행에 새로운 기사 배정
    await this.operationServiceOutPort.update(assignDto.operationId, {
      chauffeurId: assignDto.chauffeurId,
    });

    // 5. 응답 생성
    return plainToInstance(
      AssignChauffeurResponseDto,
      {
        operationId: assignDto.operationId,
        newChauffeurId: newChauffeur.id,
        newChauffeurName: newChauffeur.name,
        previousChauffeurId: previousChauffeur?.id || null,
        previousChauffeurName: previousChauffeur?.name || null,
        message: previousChauffeur
          ? `기사가 변경되었습니다. ${previousChauffeur.name} → ${newChauffeur.name}`
          : `기사가 배정되었습니다. ${newChauffeur.name}`,
      },
      classTransformDefaultOptions,
    );
  }
}
