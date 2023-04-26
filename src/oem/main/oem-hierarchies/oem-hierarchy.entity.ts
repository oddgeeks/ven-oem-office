import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Company } from '../oem-companies/oem-company.entity';
import { OemHierarchyLevelEntity } from '../oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemProductEntity } from '../oem-products/oem-product.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Tree('materialized-path')
@Index('oem_hierarchies_company_id_idx', ['companyId'], {})
@Index('oem_hierarchies_pkey', ['hierarchyId'], { unique: true })
@Index('oem_hierarchies_hierarchy_level_id_idx', ['hierarchyLevelId'], {})
//@Index('oem_hierarchies_parent_id_idx', ['parentId'], {})
@Entity('oem_hierarchies', { schema: 'oem' })
export class Hierarchy {
  constructor(data: Partial<Hierarchy> = {}) {
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'hierarchy_id' })
  hierarchyId: number;

  @Column({ type: 'integer', name: 'hierarchy_level_id' })
  hierarchyLevelId: number;

  @Column('integer', { nullable: true, name: 'parent_id' })
  parentId: number;

  @Column('character varying', { name: 'hierarchy_name', length: 128 })
  hierarchyName: string;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(() => Company, (oemCompanies) => oemCompanies.hierarchies)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @ManyToOne(
    () => OemHierarchyLevelEntity,
    (oemHierarchyLevels) => oemHierarchyLevels.hierarchies,
  )
  @JoinColumn([
    { name: 'hierarchy_level_id', referencedColumnName: 'hierarchyLevelId' },
  ])
  hierarchyLevel: OemHierarchyLevelEntity;

  //@ManyToOne(() => Hierarchy, (oemHierarchies) => oemHierarchies.hierarchies)
  //@JoinColumn([{ name: 'parent_id', referencedColumnName: 'hierarchyId' }])
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Hierarchy;

  //@OneToMany(() => Hierarchy, (oemHierarchies) => oemHierarchies.parent)
  @TreeChildren({ cascade: true })
  hierarchies: Hierarchy[];

  @OneToMany(
    () => OemProductEntity,
    (oemProducts) => oemProducts.productHierarchy,
  )
  products: OemProductEntity[];

  @OneToMany(() => OemQuoteEntity, (oemQuotes) => oemQuotes.geoHierarchy)
  quotes: OemQuoteEntity[];

  @OneToMany(() => OemVendoEntity, (oemVendos) => oemVendos.geoHierarchy)
  vendos: OemVendoEntity[];

  @OneToMany(() => OemUserEntity, (oemUsers) => oemUsers.geoHierarchy)
  users: OemUserEntity[];

  @OneToMany(
    () => OemCompanyChannel,
    (companyChannels) => companyChannels.geoHierarchy,
  )
  companyChannels: OemUserEntity[];
}

export { Hierarchy as OemHierarchyEntity };
