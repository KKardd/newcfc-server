import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('notice')
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_popup', type: 'boolean', default: false })
  isPopup: boolean;

  @Column({ name: 'popup_start_date', type: 'timestamp', nullable: true })
  popupStartDate: Date | null;

  @Column({ name: 'popup_end_date', type: 'timestamp', nullable: true })
  popupEndDate: Date | null;

  @Column({ name: 'admin_id', type: 'int' })
  adminId: number;
}
