import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { CustomColumn } from '@/domain/custom/custom-column';

@Entity('error_log')
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  service: string;

  @Index()
  @Column({ name: 'request_url', type: 'varchar', length: 1000, nullable: false })
  requestUrl: string;

  @Column({ name: 'access_token', type: 'varchar', length: 1000, nullable: true })
  accessToken: string;

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: false })
  method: string;

  @Column({ type: 'text', nullable: false })
  header: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  param: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  query: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: false })
  status: string;

  @Column({ name: 'response_body', type: 'text', nullable: true })
  responseBody: string;

  @Column({ name: 'stack_trace', type: 'text', nullable: true })
  stackTrace: string;

  @Column({ name: 'elapsed_time', type: 'int', nullable: true })
  elapsedTime: number;

  @CustomColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
