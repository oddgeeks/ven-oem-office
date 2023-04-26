import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemQuotesContacts } from '../../intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { OemVendosContacts } from '../../intermediaries/_oem-vendos-contacts/oem-vendos-contacts.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_contacts_pkey', ['contactId'], { unique: true })
@Entity('oem_contacts', { schema: 'oem' })
export class Contact {
  constructor(data: Partial<Contact> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'contact_id' })
  contactId: number;

  @Column({
    type: 'character varying',
    name: 'sf_contact_id',
    length: 36,
    nullable: true,
    default: null,
  })
  sfContactId: string | null;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  /* @Column('enum', {
     name: 'contact_type',
     enum: ContactTypeEnum,
   })
   contactType: ContactTypeEnum;*/

  @Column('character varying', {
    name: 'company_organisation_name',
    length: 64,
    nullable: true,
  })
  companyOrganisationName: string;

  @Column('character varying', { name: 'job_title', length: 128 })
  jobTitle: string;

  @Column('character varying', { name: 'last_name', length: 32 })
  lastName: string;

  @Column('character varying', { name: 'first_name', length: 32 })
  firstName: string;

  @Column('character varying', { name: 'contact_email', length: 128 })
  contactEmail: string;

  @Column('character varying', { name: 'phone', nullable: true, length: 36 })
  phone: string | null;

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

  @OneToMany(
    () => OemQuotesContacts,
    (oemQuotesContacts) => oemQuotesContacts.contact,
  )
  quotesContacts: OemQuotesContacts[];

  @OneToMany(
    () => OemVendosContacts,
    (oemVendosContacts) => oemVendosContacts.contact,
  )
  vendosContacts: OemVendosContacts[];
}

export { Contact as OemContactEntity };
