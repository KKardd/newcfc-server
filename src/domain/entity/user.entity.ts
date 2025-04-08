import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { CustomEnumColumn } from '@/domain/custom/custom-column';
import { BaseEntity } from '@/domain/entity/base.entity';
import { UserRole } from '@/domain/entity/user-role.entity';
import { UserLifecycle } from '@/domain/enum/user-life-cycle.enum';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Index()
  uuid: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Index()
  email: string;

  @Column({ name: 'tenant_id', type: 'integer', nullable: true })
  @Index()
  tenantId?: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @CustomEnumColumn({ type: 'enum', enum: UserLifecycle })
  @Index()
  status: UserLifecycle = UserLifecycle.REGISTERED;

  @Column({ name: 'department_name', type: 'varchar', length: 100, nullable: true })
  departmentName: string;

  roles?: UserRole[];
}
