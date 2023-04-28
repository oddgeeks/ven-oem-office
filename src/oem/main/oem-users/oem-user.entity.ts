import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { MinLength, Validate } from 'class-validator';

import { OemRoleEntity } from '../oem-roles/oem-role.entity';
import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { OemProductEntity } from '../oem-products/oem-product.entity';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemShadingRule } from '../oem-rules/oem-shading-rules/oem-shading-rule.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { OemWorkflowRule } from '../oem-rules/oem-workflow-rules/oem-workflow-rule.entity';
import { OemVacationRule } from '../oem-rules/oem-vacation-rules/oem-vacation-rule.entity';
import { OemNotification } from '../oem-notifications/oem-notification.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemDiscountRuleEntity } from '../oem-rules/oem-discount-rules/oem-discount-rule.entity';
import { OemNotificationPreference } from '../oem-notification-preferences/oem-notification-preference.entity';
import { OemSavedAlertRule } from '../oem-rules/oem-saved-alert-rules/oem-saved-alert-rule.entity';
import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { IsPhoneAlreadyExist } from './oem-user.validators/oem-user.validator';

@Index('oem_users_company_id_idx', ['companyId'], {})
@Index('oem_users_geo_hierarchy_id_idx', ['geoHierarchyId'], {})
@Index(
  'oem_users_sso_login_email_phone_key',
  ['phone', 'ssoLoginEmail', 'companyId'],
  {
    unique: true,
  },
)
@Index('oem_users_role_id_idx', ['roleId'], {})
@Index('oem_users_company_channel_id_idx', ['companyChannelId'], {})
@Index('oem_users_pkey', ['userId'], { unique: true })
@Entity('oem_users', { schema: 'oem' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'user_id' })
  userId: number;

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

  @Column({ type: 'integer', name: 'geo_hierarchy_id' })
  geoHierarchyId: number;

  @Column({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column('character varying', {
    name: 'organization_id',
    nullable: true,
    length: 24,
  })
  organizationId: string | null;

  @Column('character varying', {
    name: 'sf_user_id',
    nullable: true,
    length: 24,
  })
  sfUserId: string | null;

  @Column({
    type: 'integer',
    name: 'company_channel_id',
    nullable: true,
    default: null,
  })
  companyChannelId: number;

  @Column('varchar', {
    name: 'pre_populated_fields',
    nullable: true,
    array: true,
  })
  prePopulatedFields: string[] | null;

  @Column('character varying', {
    name: 'image_url',
    nullable: true,
    length: 1024,
  })
  imageUrl: string | null;

  @Column('character varying', { name: 'first_name', length: 128 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 128 })
  lastName: string;

  @Column('character varying', {
    name: 'notification_email',
    nullable: true,
    length: 256,
  })
  notificationEmail: string | null;

  //@Index({ unique: true })
  @Column('character varying', {
    name: 'sso_login_email',
    length: 256,
  })
  ssoLoginEmail: string;

  @MinLength(8)
  @Column('character varying', {
    name: 'password_encrypted',
    length: 60,
    nullable: true,
    default: null,
  })
  password: string | null;

  //@Index({ unique: true })
  //@Validate(IsPhoneAlreadyExist)
  @Column('character varying', {
    name: 'phone',
    length: 36,
    nullable: true,
    default: null,
  })
  phone: string;

  @Column('boolean', { name: 'is_external' })
  isExternal: boolean;

  @Column('character varying', { name: 'region', length: 128 })
  region: string;

  @Column('character varying', { name: 'time_zone_area', length: 48 })
  timeZoneArea: string;

  @Column('boolean', { name: 'is_hide_welcome_text' })
  isHideWelcomeText: boolean;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

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

  @ManyToOne(() => OemRoleEntity, (oemRoles) => oemRoles.users)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'roleId' }])
  role: OemRoleEntity;

  @OneToMany(() => OemQuotesUsers, (oemUsersQuotes) => oemUsersQuotes.user)
  usersQuotes: OemQuotesUsers[];

  @OneToMany(() => OemVendosUsers, (oemVendosUsers) => oemVendosUsers.user)
  vendosUsers: OemVendosUsers[];

  @OneToMany(() => OemQuoteEntity, (oemQuotes) => oemQuotes.ownerUser)
  quotes: OemQuoteEntity[];

  @OneToMany(() => OemVendoEntity, (oemVendos) => oemVendos.ownerUser)
  vendos: OemVendoEntity[];

  @OneToMany(() => OemProductEntity, (oemProducts) => oemProducts.ownerUser)
  products: OemProductEntity[];

  @ManyToOne(() => OemCompanyEntity, (oemCompanies) => oemCompanies.users)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToMany(
    () => OemShadingRule,
    (oemShadingRules) => oemShadingRules.ownerUser,
  )
  shadingRules: OemShadingRule[];

  @OneToMany(
    () => OemDiscountRuleEntity,
    (oemDiscountRule) => oemDiscountRule.ownerUser,
  )
  discountRules: OemDiscountRuleEntity[];

  @ManyToOne(
    () => OemHierarchyEntity,
    (oemHierarchies) => oemHierarchies.users,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn([
    { name: 'geo_hierarchy_id', referencedColumnName: 'hierarchyId' },
  ])
  geoHierarchy: OemHierarchyEntity;

  @OneToMany(
    () => OemShadingRule,
    (oemShadingRules) => oemShadingRules.ownerUser,
  )
  workflowRules: OemWorkflowRule[];

  @OneToMany(
    () => OemVacationRule,
    (oemVacationRules) => oemVacationRules.sourceUser,
  )
  sourceVacationRules: OemVacationRule[];

  @OneToMany(
    () => OemVacationRule,
    (oemVacationRules) => oemVacationRules.targetUser,
  )
  targetVacationRules: OemVacationRule[];

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.sender,
  )
  senderNotifications: OemNotification[];

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.receiver,
  )
  receiverNotifications: OemNotification[];

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

  @OneToOne(
    () => OemNotificationPreference,
    (notificationPreference) => notificationPreference.user,
  )
  notificationPreference: OemNotificationPreference;

  @OneToMany(() => OemSavedAlertRule, (savedAlertRules) => savedAlertRules.user)
  savedAlertRules: OemSavedAlertRule[];

  @ManyToOne(() => OemCompanyChannel, (companyChannel) => companyChannel.users)
  @JoinColumn([
    { name: 'company_channel_id', referencedColumnName: 'companyChannelId' },
  ])
  companyChannel: OemCompanyChannel;

  /*
  @OneToMany(() => OemSessions, (oemSessions) => oemSessions.user)
  oemSessions: OemSessions[];

  @OneToMany(
    () => OemUserCustomAlertRules,
    (oemUserCustomAlertRules) => oemUserCustomAlertRules.user,
  )
  oemUserCustomAlertRules: OemUserCustomAlertRules[];

  @OneToMany(
    () => OemUserNotificationSettings,
    (oemUserNotificationSettings) => oemUserNotificationSettings.user,
  )
  oemUserNotificationSettings: OemUserNotificationSettings[];

  //user address disabled
  //@Index('oem_users_address_id_idx', ['addressId'], {})
  @PrimaryGeneratedColumn({ type: 'integer', name: 'address_id' })
  addressId: number;
  @ManyToOne(() => OemAddressEntity, (oemAddresses) => oemAddresses.Users)
  @JoinColumn([{ name: 'address_id', referencedColumnName: 'addressId' }])
  address: OemAddressEntity;
*/
  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (this.password && !/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    // console.log(plainPassword, this.password);
    if (this.password === null) return false;
    return bcrypt.compare(plainPassword, this.password);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export { User as OemUserEntity };
