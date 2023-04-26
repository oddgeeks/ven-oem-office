import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_salesforce_token_pkey', ['salesforceTokenId'], {
  unique: true,
})
@Index('oem_salesforce_token_company_id_idx', ['companyId'], {})
@Entity('oem_salesforce_token', { schema: 'oem' })
export class OemSalesforceTokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'salesforce_token_id' })
  salesforceTokenId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'token',
    length: 255,
  })
  token: string;

  @Column('character varying', {
    name: 'instance_url',
    length: 1024,
  })
  instanceUrl: string;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'issued_at',
  })
  issuedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
