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
//import { OemNotifications } from "./OemNotifications";
import * as moment from 'moment-timezone';

import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemNotification } from '../oem-notifications/oem-notification.entity';

import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { OemVendosQuotes } from '../../intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';
import { OemCustomerEntity } from '../oem-customers/oem-customer.entity';
import { OemQuotesContacts } from '../../intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { OemQuotesMaterials } from '../../intermediaries/_oem-quotes-materials/oem-quotes-materials.entity';
import { OemQuoteCompanyChannel } from '../../intermediaries/_oem-quote-company-channels/oem-quote-company-channel.entity';

import { QuoteStatusEnum } from './oem-quote.enums/quote-status.enum';
import { DealTypeEnum } from './oem-quote.enums/deal-type.enum';
import { DeliveryStatusEnum } from './oem-quote.enums/delivery-status.enum';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { QuoteInternalCommentFiles } from './oem-quote.interfaces/quote-internal-comment-files.interface';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemQuotesProducts } from '../../intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { OemQuotesCustomerProducts } from '../../intermediaries/_oem-quotes-customer-products/oem-quotes-customer-products.entity';
import { OemQuotesExternalUsers } from '../../intermediaries/_oem-quotes-external-users/oem-quotes-external-users.entity';
import { MinLength } from 'class-validator';
import { IQuoteCommentSettings } from './oem-quote.interfaces/quote-comment-settings.interface';

export const PIN_CODE_LENGTH = 6;

@Index('oem_quotes_company_id_idx', ['companyId'], {})
@Index('oem_quotes_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_quotes_customer_id_idx', ['customerId'], {})
@Index('oem_quotes_geo_hierarchy_id_idx', ['geoHierarchyId'], {})
@Index('oem_quotes_pkey', ['quoteId'], { unique: true })
@Index('oem_quotes_quote_uuid_key', ['quoteUuid'], { unique: true })
@Index('oem_quotes_expires_at_idx', ['expiresAt'], {})
@Entity('oem_quotes', { schema: 'oem' })
export class Quote {
  constructor(data: Partial<Quote> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({
    type: 'integer',
    name: 'customer_id',
    nullable: true,
    default: null,
  })
  customerId: number;

  @Column({ type: 'integer', name: 'geo_hierarchy_id' })
  geoHierarchyId: number;

  @Column('character varying', { name: 'quote_uuid', unique: true, length: 36 })
  quoteUuid: string;

  @Column('character varying', {
    name: 'opportunity_id',
    nullable: true,
    length: 36,
    default: null,
  })
  opportunityId: string | null;

  @Column({
    type: 'integer',
    name: 'original_user_id',
    nullable: true,
    default: null,
  })
  originalUserId: number | null;

  @Column({
    type: 'integer',
    name: 'last_modifier_user_id',
    nullable: true,
    default: null,
  })
  lastModifierUserId: number | null;

  @Column({
    type: 'character varying',
    name: 'sf_quote_id',
    nullable: true,
    default: null,
  })
  sfQuoteId: string | null;

  @Column({
    type: 'character varying',
    name: 'sf_contract_id',
    nullable: true,
    default: null,
  })
  sfContractId: string | null;

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    name: 'gross_margin_percent',
    nullable: true,
    default: 0,
  })
  grossMarginPercent: number;

  @Column('timestamp with time zone', {
    name: 'signed_date',
    nullable: true,
    default: null,
  })
  signedDate: Date;

  @Column('timestamp with time zone', {
    name: 'approved_date',
    nullable: true,
    default: null,
  })
  approvedDate: Date;

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    name: 'total_discount',
    nullable: true,
    default: 0,
  })
  totalDiscount: number;

  @Column('character varying', {
    name: 'quote_name',
    length: 128,
    nullable: true,
    default: null,
  })
  quoteName: string;

  @MinLength(PIN_CODE_LENGTH)
  @Column('character varying', {
    name: 'pin_code',
    length: PIN_CODE_LENGTH,
    nullable: true,
    default: null,
    transformer: {
      to(value) {
        return value && String(value).toUpperCase();
      },
      from(value) {
        return value;
      },
    },
  })
  pinCode: string;

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

  @Column('enum', {
    name: 'quote_status',
    enum: QuoteStatusEnum,
    default: QuoteStatusEnum.DRAFT,
  })
  quoteStatus: QuoteStatusEnum;

  @Column('enum', {
    name: 'delivery_status',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.PENDING,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column('enum', { name: 'deal_type', enum: DealTypeEnum })
  dealType: DealTypeEnum;

  @Column('character', { name: 'currency', length: 3 })
  currency: string;

  @Column('text', { name: 'quote_comments', nullable: true })
  quoteComments: string | null;

  @Column('jsonb', {
    name: 'quote_comment_settings',
    array: false,
    default: () => `'{}'`,
    // '{
    //   "quoteDefaultComment": "This Quote is Valid Until {{expiresAt}}. “Pending” quotes require internal review before approval.",
    //   "consumptionMessage": "Quoted consumption offerings do not reflect contractually agreed upon delivery or invoice schedules. Displayed pricing is reflective of implied consumption rates and may change depending on product pricing."
    // }'
    nullable: false,
  })
  quoteCommentSettings: IQuoteCommentSettings;

  @Column('text', { name: 'quote_internal_comments', nullable: true })
  quoteInternalComments: string | null;

  @Column('jsonb', {
    name: 'quote_internal_comment_files',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  quoteInternalCommentFiles: QuoteInternalCommentFiles[];

  @Column('jsonb', {
    name: 'quote_attributes',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  quoteAttributes: object[];

  @Column('timestamp with time zone', { name: 'expires_at' })
  expiresAt: Date;

  @Column('timestamp with time zone', {
    name: 'submitted_at',
    nullable: true,
    default: null,
  })
  submittedAt: Date;

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

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  getQuoteCommentSettings() {
    const expiresAt = moment(this.expiresAt).format('MMMM Do YYYY');
    const quoteCommentSettings = this.quoteCommentSettings;
    if (quoteCommentSettings && quoteCommentSettings.quoteDefaultComment) {
      quoteCommentSettings.quoteDefaultComment =
        quoteCommentSettings.quoteDefaultComment.replace(
          '{{expiresAt}}',
          expiresAt,
        );
    }
    this.quoteCommentSettings = quoteCommentSettings;
  }

  @Column('character varying', {
    name: 'pdf_file_url',
    nullable: true,
    length: 1024,
  })
  pdfFileUrl: string | null;

  @Column('character varying', {
    name: 'excel_file_url',
    nullable: true,
    length: 1024,
  })
  excelFileUrl: string | null;

  @Column('boolean', { name: 'is_external' })
  isExternal: boolean;

  @Column('boolean', { name: 'is_black_box' })
  isBlackBox: boolean;

  @Column('boolean', { name: 'is_accepting_credit_card' })
  isAcceptingCreditCard: boolean;

  @Column('boolean', { name: 'is_requiring_signing' })
  isRequiringSigning: boolean;

  @Column('boolean', { name: 'is_locked' })
  isLocked: boolean;

  @Column('boolean', { name: 'is_distributor_visible' })
  isDistributorVisible: boolean;

  @Column('boolean', { name: 'is_reseller_visible' })
  isResellerVisible: boolean;

  @Column('boolean', { name: 'is_external_hide_invoice' })
  isExternalHideInvoice: boolean;

  @Column('boolean', { name: 'is_external_hide_unit' })
  isExternalHideUnit: boolean;

  @Column('boolean', { name: 'is_external_hide_contact' })
  isExternalHideContact: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column('boolean', { name: 'is_auto_renew', default: false })
  isAutoRenew: boolean;

  @Column('jsonb', {
    name: 'sf_metadata',
    default: () => `'{}'`,
    nullable: true,
  })
  sfMetaData: Array<object>;

  @Column('jsonb', {
    name: 'locked_fields',
    default: () => "'[]'",
    nullable: true,
  })
  lockedFields: object;

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

  @ManyToOne(() => OemCompanyEntity, (oemCompanies) => oemCompanies.quotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.quotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;

  @ManyToOne(() => OemCustomerEntity, (oemCustomers) => oemCustomers.quotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomerEntity;

  @OneToMany(
    () => OemQuotesContacts,
    (oemQuotesContacts) => oemQuotesContacts.quote,
  )
  quotesContacts: OemQuotesContacts[];

  @OneToMany(
    () => OemQuotesProducts,
    (oemQuotesProducts) => oemQuotesProducts.quote,
  )
  quotesProducts: OemQuotesProducts[];

  @OneToMany(
    () => OemQuotesMaterials,
    (oemQuotesMaterials) => oemQuotesMaterials.quote,
  )
  quotesMaterials: OemQuotesMaterials[];

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.quote,
  )
  notifications: OemNotification[];

  @ManyToOne(() => OemHierarchyEntity, (oemHierarchy) => oemHierarchy.quotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'geo_hierarchy_id', referencedColumnName: 'hierarchyId' },
  ])
  geoHierarchy: OemHierarchyEntity;

  /* @OneToMany(
    () => OemDiscountEntity,
    (oemDiscount) => oemDiscount.quote,
  )
  discounts: OemDiscountEntity[];*/

  @OneToMany(() => OemQuotesUsers, (oemUsersQuotes) => oemUsersQuotes.quote)
  usersQuotes: OemQuotesUsers[];

  @OneToMany(
    () => OemQuotesExternalUsers,
    (oemUsersQuotes) => oemUsersQuotes.quote,
  )
  externalUsersQuotes: OemQuotesExternalUsers[];

  @OneToMany(() => OemVendosQuotes, (oemVendosQuotes) => oemVendosQuotes.quote)
  vendosQuotes: OemVendosQuotes[];

  @OneToMany(
    () => OemQuoteApprovalQueue,
    (quoteApprovalQueues) => quoteApprovalQueues.quote,
  )
  quoteApprovalQueues: OemQuoteApprovalQueue[];

  @OneToMany(
    () => OemRecentlyViewedQuotesVendos,
    (recentlyViewedQuotesVendos) => recentlyViewedQuotesVendos.quote,
  )
  recentlyViewedQuotes: OemRecentlyViewedQuotesVendos[];

  @OneToMany(
    () => OemQuotesCustomerProducts,
    (quoteCustomerProducts) => quoteCustomerProducts.quote,
  )
  quoteCustomerProducts: OemQuotesCustomerProducts[];

  @OneToMany(
    () => OemQuoteCompanyChannel,
    (quoteCompanyChannels) => quoteCompanyChannels.quote,
  )
  quoteCompanyChannels: OemQuoteCompanyChannel[];

  public generatePinCode() {
    const length = PIN_CODE_LENGTH;
    this.pinCode = Math.round(
      Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
    )
      .toString(36)
      .slice(1)
      .toUpperCase();
  }

  public checkPinCode(pinCode): boolean {
    if (this.pinCode === null) return false;
    return this.pinCode === pinCode.toUpperCase();
  }
}

export { Quote as OemQuoteEntity };
