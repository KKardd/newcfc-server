import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { BaseTimeEntity } from '@/domain/entity/basetime.entity';

export enum NotificationType {
  NEW_OPERATION = 'NEW_OPERATION',
  OPERATION_CANCELLED = 'OPERATION_CANCELLED',
  OPERATION_STATUS_UPDATE = 'OPERATION_STATUS_UPDATE',
  EMERGENCY = 'EMERGENCY',
  GENERAL = 'GENERAL',
}

@Entity('notifications')
export class Notification extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  @Index()
  userId: number;

  @Column({ name: 'user_type', type: 'varchar', length: 20, nullable: false })
  @Index()
  userType: string; // 'CHAUFFEUR', 'ADMIN' 등

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ enum: NotificationType, type: 'enum', nullable: false })
  @Index()
  type: NotificationType;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  @Index()
  isRead: boolean;

  @Column({ name: 'read_at', type: 'datetime', nullable: true })
  readAt: Date;

  @Column({ name: 'fcm_message_id', type: 'varchar', length: 255, nullable: true })
  fcmMessageId: string;
}