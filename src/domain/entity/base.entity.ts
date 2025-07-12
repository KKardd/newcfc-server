import { Column, Index } from 'typeorm';

import { BaseTimeEntity } from '@/domain/entity/basetime.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';

export class BaseEntity extends BaseTimeEntity {
  @Column({ enum: DataStatus, type: 'enum', default: DataStatus.REGISTER })
  @Index()
  status: DataStatus;

  @Column({ name: 'created_by', type: 'integer', nullable: false })
  @Index()
  createdBy: number;

  @Column({ name: 'updated_by', type: 'integer', nullable: false })
  @Index()
  updatedBy: number;
}
