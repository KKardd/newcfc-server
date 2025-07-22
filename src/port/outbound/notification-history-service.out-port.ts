import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { Notification } from '@/domain/entity/notification.entity';

export abstract class NotificationHistoryServiceOutPort {
  abstract create(notification: Notification): Promise<Notification>;
  abstract findByUserId(userId: number, userType: string, search: SearchNotificationDto): Promise<Notification[]>;
  abstract markAsRead(userId: number, userType: string, notificationIds?: number[]): Promise<void>;
  abstract markAllAsRead(userId: number, userType: string): Promise<void>;
  abstract findById(id: number): Promise<Notification | null>;
  abstract hasUnreadNotifications(userId: number, userType: string): Promise<boolean>;
}
