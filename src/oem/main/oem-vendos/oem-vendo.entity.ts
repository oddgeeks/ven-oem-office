import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';

import { VendoStatusEnum } from './oem-vendo.enums/vendo-status.enum';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';

import { OemCustomerEntity } from '../oem-customers/oem-customer.entity';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemVendosQuotes } from '../../intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';
import { OemVendosContacts } from '../../intermediaries/_oem-vendos-contacts/oem-vendos-contacts.entity';
import { OemVendosMaterials } from '../../intermediaries/_oem-vendos-materials/oem-vendos-materials.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { OemNotification } from '../oem-notifications/oem-notification.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_vendos_company_id_idx', ['companyId'], {})
@Index('oem_vendos_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_vendos_customer_id_idx', ['customerId'], {})
@Index('oem_vendos_geo_hierarchy_id_idx', ['geoHierarchyId'], {})
@Index('oem_vendos_pkey', ['vendoId'], { unique: true })
@Index('oem_vendos_vendo_uuid_key', ['vendoUuid', 'companyId'], {
  unique: true,
})
@Index('oem_vendos_expires_at_idx', ['expiresAt'], {})
@Entity('oem_vendos', { schema: 'oem' })
export class Vendo {
  constructor(data: Partial<Vendo> = {}) {
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column({
    type: 'integer',
    name: 'customer_id',
    nullable: true,
    default: null,
  })
  customerId: number;

  @Column({ type: 'integer', name: 'geo_hierarchy_id' })
  geoHierarchyId: number;

  @Column('character varying', { name: 'vendo_uuid', unique: true, length: 36 })
  vendoUuid: string;

  @Column('character varying', {
    name: 'opportunity_id',
    nullable: true,
    length: 36,
    default: null,
  })
  opportunityId: string | null;

  @Column('boolean', { name: 'is_external' })
  isExternal: boolean;

  @Column('character varying', {
    name: 'vendo_name',
    nullable: true,
    length: 128,
    default: null,
  })
  vendoName: string | null;

  @Column('text', { name: 'vendo_comments', nullable: true })
  vendoComments: string | null;

  @Column('enum', {
    name: 'vendo_status',
    enum: VendoStatusEnum,
    default: VendoStatusEnum.DRAFT,
  })
  vendoStatus: VendoStatusEnum;

  @Column('timestamp with time zone', { name: 'expires_at' })
  expiresAt: Date;

  @Column('timestamp with time zone', {
    name: 'submitted_at',
    nullable: true,
    default: null,
  })
  submittedAt: Date;

  @Column('numeric', {
    name: 'net_amount',
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  netAmount: number;

  daysSinceSubmission: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  getDaysSinceSubmission() {
    if (!this.submittedAt) {
      this.daysSinceSubmission = null;
      return;
    }

    const days = moment.utc().diff(moment.utc(this.submittedAt), 'days');
    this.daysSinceSubmission = `${days} day(s)`;
  }

  @Column('character varying', {
    name: 'pdf_file_url',
    nullable: true,
    length: 1024,
  })
  pdfFileUrl: string | null;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_locked', default: true })
  isLocked: boolean;

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

  @ManyToOne(() => OemCompanyEntity, (oemCompanies) => oemCompanies.vendos)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.vendos)
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;

  @ManyToOne(() => OemCustomerEntity, (oemCustomers) => oemCustomers.vendos)
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomerEntity;

  @OneToMany(
    () => OemVendosContacts,
    (oemVendosContacts) => oemVendosContacts.vendo,
  )
  vendosContacts: OemVendosContacts[];

  @OneToMany(
    () => OemVendosMaterials,
    (oemVendosMaterials) => oemVendosMaterials.vendo,
  )
  vendosMaterials: OemVendosMaterials[];

  @OneToMany(() => OemVendosQuotes, (oemVendosQuotes) => oemVendosQuotes.vendo)
  vendosQuotes: OemVendosQuotes[];

  @OneToMany(() => OemVendosUsers, (oemVendosUsers) => oemVendosUsers.vendo)
  vendosUsers: OemVendosUsers[];

  @OneToMany(
    () => OemVendoApprovalQueue,
    (vendoApprovalQueues) => vendoApprovalQueues.vendo,
  )
  vendoApprovalQueues: OemVendoApprovalQueue[];

  @OneToMany(
    () => OemRecentlyViewedQuotesVendos,
    (recentlyViewedQuotesVendos) => recentlyViewedQuotesVendos.vendo,
  )
  recentlyViewedVendos: OemRecentlyViewedQuotesVendos[];

  @OneToMany(() => OemNotification, (notifications) => notifications.vendo)
  notifications: OemNotification[];

  @ManyToOne(() => OemHierarchyEntity, (oemHierarchy) => oemHierarchy.vendos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'geo_hierarchy_id', referencedColumnName: 'hierarchyId' },
  ])
  geoHierarchy: OemHierarchyEntity;
}

export { Vendo as OemVendoEntity };
