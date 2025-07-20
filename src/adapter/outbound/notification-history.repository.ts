import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

import { SearchNotificationDto } from '@/adapter/inbound/dto/request/notification/search-notification.dto';
import { Notification } from '@/domain/entity/notification.entity';
import { NotificationHistoryServiceOutPort } from '@/port/outbound/notification-history-service.out-port';

@Injectable()
export class NotificationHistoryRepository implements NotificationHistoryServiceOutPort {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    return await this.notificationRepository.save(notification);
  }

  async findByUserId(userId: number, userType: string, search: SearchNotificationDto): Promise<Notification[]> {
    const where: any = {
      userId,
      userType,
    };

    if (search.type) {
      where.type = search.type;
    }

    if (search.isRead !== undefined) {
      where.isRead = search.isRead;
    }

    if (search.startDate) {
      where.createdAt = MoreThanOrEqual(new Date(search.startDate));
    }

    if (search.endDate) {
      if (where.createdAt) {
        // startDate와 endDate가 모두 있는 경우
        where.createdAt = [MoreThanOrEqual(new Date(search.startDate)), LessThanOrEqual(new Date(search.endDate))];
      } else {
        where.createdAt = LessThanOrEqual(new Date(search.endDate));
      }
    }

    return await this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(userId: number, userType: string, notificationIds?: number[]): Promise<void> {
    const where: any = {
      userId,
      userType,
      isRead: false,
    };

    if (notificationIds && notificationIds.length > 0) {
      where.id = In(notificationIds);
    }

    await this.notificationRepository.update(where, {
      isRead: true,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId: number, userType: string): Promise<void> {
    await this.notificationRepository.update(
      {
        userId,
        userType,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.notificationRepository.findOne({ where: { id } });
  }
}