import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { ExternalUserTypeEnum } from './oem-external-user.enums/external-user-type.enum';
import { OemQuotesExternalUsers } from '../../intermediaries/_oem-quotes-external-users/oem-quotes-external-users.entity';

@Index('oem_external_users_company_id_idx', ['companyId'], {})
@Index('oem_external_users_pkey', ['externalUserId'], {
  unique: true,
})
@Entity('oem_external_users', { schema: 'oem' })
export class ExternalUser {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'external_user_id' })
  externalUserId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'company_organisation_name',
    length: 64,
    nullable: true,
  })
  companyOrganisationName: string;

  @Column('character varying', { name: 'first_name', length: 128 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 128 })
  lastName: string;

  @Column('character varying', {
    name: 'phone',
    length: 36,
  })
  phone: string;

  @Column('character varying', {
    name: 'email',
    length: 256,
  })
  email: string;

  @Column('enum', {
    name: 'externalUserType',
    enum: ExternalUserTypeEnum,
  })
  externalUserType: ExternalUserTypeEnum;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(
    () => OemQuotesExternalUsers,
    (oemUsersQuotes) => oemUsersQuotes.user,
  )
  externalUsersQuotes: OemQuotesExternalUsers[];

  /*@OneToMany(() => OemVendosUsers, (oemVendosUsers) => oemVendosUsers.user)
  externalUsersVendos: OemVendosExternalUsers[];*/

  @ManyToOne(() => OemCompanyEntity, (oemCompanies) => oemCompanies.users)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToMany(
    () => OemQuoteApprovalQueue,
    (quoteApprovalQueues) => quoteApprovalQueues.user,
  )
  quoteApprovalQueues: OemQuoteApprovalQueue[];

  @OneToMany(
    () => OemVendoApprovalQueue,
    (vendoApprovalQueues) => vendoApprovalQueues.user,
  )
  vendoApprovalQueues: OemVendoApprovalQueue[];

  constructor(data: Partial<ExternalUser> = {}) {
    Object.assign(this, data);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export { ExternalUser as OemExternalUserEntity };
