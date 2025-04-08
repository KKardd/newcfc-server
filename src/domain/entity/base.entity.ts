import { Column, Index } from 'typeorm';

import { BaseTimeEntity } from '@/domain/entity/basetime.entity';

export class BaseEntity extends BaseTimeEntity {
  @Column({ name: 'created_by', type: 'integer', nullable: false })
  @Index()
  createdBy: number;

  @Column({ name: 'updated_by', type: 'integer', nullable: false })
  @Index()
  updatedBy: number;
}
