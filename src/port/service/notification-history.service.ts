import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { NotificationResponseDto } from '@/adapter/inbound/dto/response/notification/notification-response.dto';
import { NotificationHistoryServiceInPort } from '@/port/inbound/notification-history-service.in-port';
import { NotificationHistoryServiceOutPort } from '@/port/outbound/notification-history-service.out-port';

@Injectable()
export class NotificationHistoryService implements NotificationHistoryServiceInPort {
  constructor(private readonly notificationHistoryServiceOutPort: NotificationHistoryServiceOutPort) {}

  async getMyNotifications(userId: number, userType: string, search: SearchNotificationDto): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationHistoryServiceOutPort.findByUserId(userId, userType, search);

    // 조회 후 읽지 않은 알림들을 모두 읽음 처리
    const unreadNotificationIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadNotificationIds.length > 0) {
      await this.notificationHistoryServiceOutPort.markAsRead(userId, userType, unreadNotificationIds);

      // 읽음 상태 업데이트
      notifications.forEach((notification) => {
        if (unreadNotificationIds.includes(notification.id)) {
          notification.isRead = true;
          notification.readAt = new Date();
        }
      });
    }

    return plainToInstance(NotificationResponseDto, notifications);
  }

  async markAsRead(userId: number, userType: string, notificationIds?: number[]): Promise<void> {
    await this.notificationHistoryServiceOutPort.markAsRead(userId, userType, notificationIds);
  }
}
