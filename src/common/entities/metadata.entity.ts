import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

/*@Entity()*/
export class MetadataEntity {
  /*  @Index()*/
  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date | string;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;
}
