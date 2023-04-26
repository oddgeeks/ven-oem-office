import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
//TODO: we should have seperated service for env variables validation and everything should go through config service
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_salesforce_integrations_pkey', ['salesforceIntegrationId'], {
  unique: true,
})
@Index('oem_salesforce_integration_company_id_idx', ['companyId'], {})
@Entity('oem_salesforce_integrations', { schema: 'oem' })
export class SalesforceIntegrationEntity {
  private _cryptr: {
    encrypt: any;
    decrypt: any;
  };
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'salesforce_integration_id',
  })
  salesforceIntegrationId!: number;

  @Column('character varying', {
    name: 'salesforce_url',
    unique: true,
    length: 128,
  })
  salesforceURL: string;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'salesforce_client_id',
    unique: true,
    length: 128,
  })
  salesforceClientId: string;

  @Column('character varying', {
    name: 'salesforce_client_secret',
    unique: true,
    length: 1024,
    /* transformer: {
      to(value) {
        return this._cryptr.encrypt(value);
      },
      from(value) {
        return this._cryptr.decrypt(value);
      },
    },*/
  })
  salesforceClientSecret: string;

  salesforceClientSecretLast4: string;

  @Column('character varying', {
    name: 'salesforce_username',
    unique: true,
    length: 128,
  })
  salesforceUsername: string;

  @Column('character varying', {
    name: 'salesforce_password',
    unique: true,
    length: 128,
  })
  salesforcePassword: string;

  @Column('jsonb', {
    name: 'settings',
    array: false,
    default: () => `'{}'`,
    nullable: true,
  })
  settings: object;

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

  @AfterInsert()
  @AfterUpdate()
  @AfterLoad()
  private getSalesForceLast4() {
    if (this.salesforceClientSecret) {
      this.salesforceClientSecretLast4 = this._cryptr
        .decrypt(this.salesforceClientSecret)
        .slice(-4);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  private encrypt() {
    if (this.salesforceClientSecret) {
      this.salesforceClientSecret = this._cryptr.encrypt(
        this.salesforceClientSecret,
      );
    }
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  private decrypt() {
    if (this.salesforceClientSecret) {
      this.salesforceClientSecret = this._cryptr.decrypt(
        this.salesforceClientSecret,
      );
    }
  }
}

export { SalesforceIntegrationEntity as OemSalesforceIntegrationEntity };
