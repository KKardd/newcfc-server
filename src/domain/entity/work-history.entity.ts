import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

@Entity('work_history')
export class WorkHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chauffeur_id', type: 'integer', nullable: false })
  chauffeurId: number;

  @Column({ name: 'vehicle_id', type: 'integer', nullable: true })
  vehicleId: number | null;

  @Column({ name: 'start_time', type: 'timestamp', nullable: false })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date | null;

  @Column({ name: 'total_minutes', type: 'integer', nullable: true })
  totalMinutes: number | null;

  @Column({ type: 'text', nullable: true })
  memo: string | null;

  @Column({ type: 'enum', enum: DataStatus, default: DataStatus.REGISTER })
  status: DataStatus;
}
