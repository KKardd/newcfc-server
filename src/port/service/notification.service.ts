import { Injectable } from '@nestjs/common';

import { FCMService, FCMNotificationPayload } from '@/infrastructure/notification/fcm.service';
import { NotificationServiceOutPort } from '@/port/outbound/notification-service.out-port';
import { ChauffeurServiceOutPort } from '@/port/outbound/chauffeur-service.out-port';
import { OperationServiceOutPort } from '@/port/outbound/operation-service.out-port';

@Injectable()
export class NotificationService implements NotificationServiceOutPort {
  constructor(
    private readonly fcmService: FCMService,
    private readonly chauffeurServiceOutPort: ChauffeurServiceOutPort,
    private readonly operationServiceOutPort: OperationServiceOutPort,
  ) {}

  /**
   * 예약(운행) 생성 시 기사에게 알림 전송
   */
  async sendReservationNotification(chauffeurId: number, operationId: number, message: string): Promise<boolean> {
    try {
      // 기사 정보 조회 (FCM 토큰 포함)
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
      if (!chauffeur || !chauffeur.fcmToken) {
        console.log(`기사 ID ${chauffeurId}의 FCM 토큰이 없습니다.`);
        return false;
      }

      // 운행 정보 조회
      const operation = await this.operationServiceOutPort.findById(operationId);
      if (!operation) {
        console.log(`운행 ID ${operationId}를 찾을 수 없습니다.`);
        return false;
      }

      const payload: FCMNotificationPayload = {
        title: '새로운 운행 배정',
        body: message || `새로운 운행이 배정되었습니다.`,
        data: {
          type: 'NEW_OPERATION',
          operationId: operationId.toString(),
          chauffeurId: chauffeurId.toString(),
          operationType: operation.type,
          startTime: operation.startTime?.toISOString() || '',
        },
      };

      const success = await this.fcmService.sendToDevice(chauffeur.fcmToken, payload);
      
      if (success) {
        console.log(`기사 ${chauffeur.name}(ID: ${chauffeurId})에게 운행 알림을 성공적으로 전송했습니다.`);
      }
      
      return success;
    } catch (error) {
      console.error('예약 알림 전송 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * 단일 기기에 FCM 알림 전송
   */
  async sendToDevice(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> {
    const payload: FCMNotificationPayload = { title, body, data };
    return await this.fcmService.sendToDevice(fcmToken, payload);
  }

  /**
   * 여러 기기에 FCM 알림 전송
   */
  async sendToMultipleDevices(fcmTokens: string[], title: string, body: string, data?: Record<string, string>): Promise<any> {
    const payload: FCMNotificationPayload = { title, body, data };
    return await this.fcmService.sendToMultipleDevices(fcmTokens, payload);
  }

  /**
   * FCM 토큰 유효성 검증
   */
  async validateToken(fcmToken: string): Promise<boolean> {
    return await this.fcmService.validateToken(fcmToken);
  }

  /**
   * 운행 취소 알림 전송
   */
  async sendOperationCancellationNotification(chauffeurId: number, operationId: number, reason?: string): Promise<boolean> {
    try {
      // 기사 정보 조회 (FCM 토큰 포함)
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
      if (!chauffeur || !chauffeur.fcmToken) {
        console.log(`기사 ID ${chauffeurId}의 FCM 토큰이 없습니다.`);
        return false;
      }

      // 운행 정보 조회
      const operation = await this.operationServiceOutPort.findById(operationId);
      if (!operation) {
        console.log(`운행 ID ${operationId}를 찾을 수 없습니다.`);
        return false;
      }

      const payload: FCMNotificationPayload = {
        title: '운행 취소 알림',
        body: reason || `배정된 운행이 취소되었습니다.`,
        data: {
          type: 'OPERATION_CANCELLED',
          operationId: operationId.toString(),
          chauffeurId: chauffeurId.toString(),
          operationType: operation.type,
          startTime: operation.startTime?.toISOString() || '',
          cancellationReason: reason || '',
        },
      };

      const success = await this.fcmService.sendToDevice(chauffeur.fcmToken, payload);
      
      if (success) {
        console.log(`기사 ${chauffeur.name}(ID: ${chauffeurId})에게 운행 취소 알림을 성공적으로 전송했습니다.`);
      }
      
      return success;
    } catch (error) {
      console.error('운행 취소 알림 전송 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * 운행 상태 변경 알림 전송
   */
  async sendOperationStatusNotification(chauffeurId: number, operationId: number, status: string): Promise<boolean> {
    try {
      const chauffeur = await this.chauffeurServiceOutPort.findById(chauffeurId);
      if (!chauffeur || !chauffeur.fcmToken) {
        return false;
      }

      const payload: FCMNotificationPayload = {
        title: '운행 상태 업데이트',
        body: `운행 상태가 ${status}로 변경되었습니다.`,
        data: {
          type: 'OPERATION_STATUS_UPDATE',
          operationId: operationId.toString(),
          chauffeurId: chauffeurId.toString(),
          status,
        },
      };

      return await this.fcmService.sendToDevice(chauffeur.fcmToken, payload);
    } catch (error) {
      console.error('운행 상태 알림 전송 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * 긴급 알림 전송 (모든 활성 기사에게)
   */
  async sendEmergencyNotification(title: string, body: string): Promise<boolean> {
    try {
      // 활성 상태의 모든 기사 조회 (FCM 토큰이 있는 기사만)
      // 실제 구현 시에는 chauffeurServiceOutPort에 적절한 메서드가 필요합니다
      
      const payload: FCMNotificationPayload = {
        title,
        body,
        data: {
          type: 'EMERGENCY',
          priority: 'high',
        },
      };

      // 토픽을 사용한 전체 전송 (모든 기사가 'all_chauffeurs' 토픽을 구독한다고 가정)
      await this.fcmService.sendToTopic('all_chauffeurs', payload);
      return true;
    } catch (error) {
      console.error('긴급 알림 전송 중 오류 발생:', error);
      return false;
    }
  }
}