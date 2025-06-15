import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { NoticeTarget } from '@/domain/enum/notice-target.enum';

@Entity('notice')
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ name: 'admin_id', type: 'integer', nullable: false })
  adminId: number;

  @Column({ name: 'published_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @Column({ type: 'enum', enum: NoticeTarget, default: NoticeTarget.ALL })
  target: NoticeTarget;

  @Column({ name: 'is_popup', type: 'boolean', default: false })
  isPopup: boolean;

  @Column({ name: 'popup_start_date', type: 'timestamp', nullable: true })
  popupStartDate: Date | null;

  @Column({ name: 'popup_end_date', type: 'timestamp', nullable: true })
  popupEndDate: Date | null;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
