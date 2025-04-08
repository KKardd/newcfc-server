import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { CustomEnumColumn } from '@/domain/custom/custom-column';
import { BaseEntity } from '@/domain/entity/base.entity';
import { DataStatus } from '@/domain/enum/data-status.enum';
import { TenantUserRole } from '@/domain/enum/tenant-user-role.enum';

@Entity('user_role')
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  @Index()
  userId: number;

  @CustomEnumColumn({ type: 'enum', enum: TenantUserRole, default: TenantUserRole.ROLE_TENANT_USER })
  @Index()
  role: TenantUserRole = TenantUserRole.ROLE_TENANT_USER;

  @CustomEnumColumn({ type: 'enum', enum: DataStatus, default: DataStatus.USED })
  @Index()
  status: DataStatus = DataStatus.USED;

  @BeforeInsert()
  async generateData() {}
}
