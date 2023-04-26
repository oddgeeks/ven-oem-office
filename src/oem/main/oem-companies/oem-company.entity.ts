import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemCompanyAddressesEntity } from '../../intermediaries/_oem-company-addresses/oem-company-addresses.entity';
import { OemRoleEntity } from '../oem-roles/oem-role.entity';
import { PermitCreditCardsEnum } from './oem-company.enums/permit-credit-cards.enum';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemShadingRule } from '../oem-shading-rules/oem-shading-rule.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { OemHierarchyLevelEntity } from '../oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemLicensingProgramEntity } from '../oem-licensing-programs/oem-licensing-program.entity';
import { OemPricingModelEntity } from '../oem-pricing-models/oem-pricing-model.entity';
import { OemWorkflowRule } from '../oem-workflow-rules/oem-workflow-rule.entity';
import { OemVacationRule } from '../oem-vacation-rules/oem-vacation-rule.entity';
import { OemNotification } from '../oem-notifications/oem-notification.entity';
import { OemApprovalQueuePriority } from '../oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { SettingsType } from './oem-company.types/settings.type';
import { OemSavedAlertRule } from '../oem-saved-alert-rules/oem-saved-alert-rule.entity';
import { OemQuoteAndVendoUuid } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.entity';
import { OemCompanyProgram } from '../../intermediaries/_oem-company-programs/oem-company-program.entity';
import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { OemCustomerAddresses } from '../../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';

@Index(
  'oem_companies_company_name_company_email_key',
  ['companyEmail', 'companyName'],
  { unique: true },
)
@Index('oem_companies_pkey', ['companyId'], { unique: true })
@Entity('oem_companies', { schema: 'oem' })
export class Company {
  constructor(data: Partial<Company> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'company_id' })
  companyId: number;

  @Column('character varying', {
    name: 'company_name',
    unique: true,
    length: 128,
  })
  companyName: string;

  @Column('character varying', {
    name: 'subdomain',
    unique: true,
    length: 128,
    transformer: {
      to(value) {
        return `${value}`.toLowerCase();
      },
      from(value) {
        return `${value}`.toLowerCase();
      },
    },
  })
  subdomain: string;

  @Column('character varying', {
    name: 'email_domain',
    unique: true,
    length: 128,
    transformer: {
      to(value) {
        return `${value}`.toLowerCase();
      },
      from(value) {
        return `${value}`.toLowerCase();
      },
    },
  })
  emailDomain: string;

  @Column('character varying', {
    name: 'company_email',
    unique: true,
    length: 128,
  })
  companyEmail: string;

  @Column('character varying', {
    name: 'logo_url',
    nullable: true,
    length: 1024,
  })
  logoUrl: string | null;

  @Column('numeric', {
    name: 'default_quote_expiration',
    nullable: true,
    precision: 4,
    scale: 0,
    default: 90,
    transformer: {
      to(value) {
        return value && Number(value);
      },
      from(value) {
        return value && Number(value);
      },
    },
  })
  defaultQuoteExpiration: number;

  @Column('character varying', {
    name: 'bank_name',
    nullable: true,
    length: 256,
  })
  bankName: string | null;

  @Column('character varying', {
    name: 'bank_account_number',
    nullable: true,
    length: 36,
  })
  bankAccountNumber: string | null;

  @Column('character varying', {
    name: 'bank_routing_number',
    nullable: true,
    length: 36,
  })
  bankRoutingNumber: string | null;

  @Column('character varying', {
    name: 'phone',
    length: 36,
  })
  phone: string;

  @Column('varchar', { name: 'deal_attributes', array: true })
  dealAttributes: string[];

  @Column('jsonb', {
    name: 'settings',
    array: false,
    default: () =>
      '\'{"companyPrimaryColor":{"a":1,"b":187,"g":137,"r":74},"customListPriceName":"List Price","customCustomerPriceName":"Price To Customer"}\'',
    nullable: false,
  })
  settings: SettingsType;

  @Column('character varying', {
    name: 'website_url',
    nullable: true,
    length: 1024,
  })
  websiteUrl: string | null;

  @Column('enum', {
    name: 'permit_credit_cards',
    enum: PermitCreditCardsEnum,
  })
  permitCreditCards: PermitCreditCardsEnum;

  @Column('boolean', { name: 'is_permit_signing' })
  isPermitSigning: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | string;

  @OneToOne(
    () => OemCompanyAddressesEntity,
    (oemCompanyAddresses) => oemCompanyAddresses.company,
    {
      cascade: true,
    },
  )
  companyAddress: OemCompanyAddressesEntity;

  @OneToMany(() => OemRoleEntity, (role) => role.company, {
    //cascade: true,
  })
  roles: OemRoleEntity[];

  @OneToMany(() => OemQuoteEntity, (oemQuotes) => oemQuotes.company)
  quotes: OemQuoteEntity[];

  @OneToMany(() => OemVendoEntity, (oemVendos) => oemVendos.company)
  vendos: OemVendoEntity[];

  @OneToMany(() => OemUserEntity, (oemUsers) => oemUsers.company)
  users: OemUserEntity[];

  @OneToMany(() => OemShadingRule, (oemShadingRules) => oemShadingRules.company)
  shadingRules: OemShadingRule[];

  @OneToMany(
    () => OemHierarchyEntity,
    (oemHierarchies) => oemHierarchies.company,
  )
  hierarchies: OemHierarchyEntity[];

  @OneToMany(
    () => OemHierarchyLevelEntity,
    (oemHierarchyLevels) => oemHierarchyLevels.company,
  )
  hierarchyLevels: OemHierarchyLevelEntity[];

  @OneToMany(
    () => OemLicensingProgramEntity,
    (oemLicensingPrograms) => oemLicensingPrograms.company,
  )
  licensingPrograms: OemLicensingProgramEntity[];

  @OneToMany(
    () => OemPricingModelEntity,
    (oemPricingModels) => oemPricingModels.company,
  )
  pricingModels: OemPricingModelEntity[];

  @OneToMany(
    () => OemWorkflowRule,
    (oemWorkflowRules) => oemWorkflowRules.company,
  )
  workflowRules: OemWorkflowRule[];

  @OneToMany(
    () => OemVacationRule,
    (oemVacationRules) => oemVacationRules.company,
  )
  vacationRules: OemVacationRule[];

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.company,
  )
  notifications: OemNotification[];

  @OneToMany(() => OemApprovalQueuePriority, (priorities) => priorities.company)
  priorities: OemApprovalQueuePriority[];

  @OneToMany(
    () => OemQuoteApprovalQueue,
    (quoteApprovalQueues) => quoteApprovalQueues.company,
  )
  quoteApprovalQueues: OemQuoteApprovalQueue[];

  @OneToMany(
    () => OemVendoApprovalQueue,
    (vendoApprovalQueues) => vendoApprovalQueues.company,
  )
  vendoApprovalQueues: OemVendoApprovalQueue[];

  @OneToMany(
    () => OemSavedAlertRule,
    (savedAlertRules) => savedAlertRules.company,
  )
  savedAlertRules: OemSavedAlertRule[];

  @OneToMany(
    () => OemQuoteAndVendoUuid,
    (quoteAndVendoUuids) => quoteAndVendoUuids.company,
  )
  quoteAndVendoUuids: OemQuoteAndVendoUuid[];

  @OneToMany(
    () => OemCompanyProgram,
    (companyPrograms) => companyPrograms.company,
  )
  companyPrograms: OemCompanyProgram[];

  @OneToMany(
    () => OemCompanyChannel,
    (companyChannels) => companyChannels.company,
  )
  companyChannels: OemCompanyChannel[];

  @OneToMany(
    () => OemCustomerAddresses,
    (customerAddresses) => customerAddresses.company,
  )
  customerAddresses: OemCustomerAddresses[];
}

export { Company as OemCompanyEntity };
