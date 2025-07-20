import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { NotificationResponseDto } from '@/adapter/inbound/dto/response/notification/notification-response.dto';

export abstract class NotificationHistoryServiceInPort {
  abstract getMyNotifications(
    userId: number,
    userType: string,
    search: SearchNotificationDto,
  ): Promise<NotificationResponseDto[]>;
  abstract markAsRead(userId: number, userType: string, notificationIds?: number[]): Promise<void>;
}
