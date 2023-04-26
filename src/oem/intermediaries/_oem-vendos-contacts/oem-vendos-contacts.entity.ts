import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemContactEntity } from '../../main/oem-contacts/oem-contact.entity';
import { OemVendoEntity } from '../../main/oem-vendos/oem-vendo.entity';
import { TypeEnum } from '../_oem-quotes-contacts/oem-quotes-contacts.enums/type.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_vendos_contacts_contact_id_idx', ['contactId'], {})
@Index('oem_vendos_contacts_vendo_id_idx', ['vendoId'], {})
@Entity('oem_vendos_contacts', { schema: 'oem' })
export class VendosContacts {
  constructor(data: Partial<VendosContacts> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @PrimaryColumn({ type: 'integer', name: 'contact_id' })
  contactId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('decimal', {
    name: 'position',
    precision: 3,
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  position: number;

  @Column('enum', {
    name: 'type',
    enum: TypeEnum,
  })
  type: TypeEnum;

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

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_owner', default: false })
  isOwner: boolean;

  @ManyToOne(
    () => OemContactEntity,
    (oemContacts) => oemContacts.vendosContacts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'contact_id', referencedColumnName: 'contactId' }])
  contact: OemContactEntity;

  @ManyToOne(() => OemVendoEntity, (oemVendos) => oemVendos.vendosContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: OemVendoEntity;
}

export { VendosContacts as OemVendosContacts };
