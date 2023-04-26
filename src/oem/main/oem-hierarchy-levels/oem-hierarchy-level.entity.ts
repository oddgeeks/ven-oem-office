import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Hierarchy } from '../oem-hierarchies/oem-hierarchy.entity';
import { Company } from '../oem-companies/oem-company.entity';
import { HierarchyTypeEnum } from './oem-hierarchy-level.enums/hierarchy-type.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_product_hierarchy_levels_company_id_idx', ['companyId'], {})
@Index('oem_product_hierarchy_levels_pkey', ['hierarchyLevelId'], {
  unique: true,
})
@Index('oem_product_hierarchy_levels_level_name_level_key', [
  'level',
  'levelName',
  'companyId',
])
@Entity('oem_hierarchy_levels', { schema: 'oem' })
export class HierarchyLevel {
  constructor(data: Partial<HierarchyLevel> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'hierarchy_level_id' })
  hierarchyLevelId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'level_name',
    // unique: true,
    length: 128,
  })
  levelName: string;

  @Column('enum', {
    name: 'hierarchy_type',
    enum: HierarchyTypeEnum,
  })
  hierarchyType: HierarchyTypeEnum;

  @Column('numeric', {
    name: 'level',
    precision: 3,
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseInt(value);
      },
    },
  })
  level: number;

  @Column('boolean', { name: 'is_editable', default: true })
  isEditable: boolean;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

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

  @Column({
    name: 'is_global',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isGlobal: boolean;

  @OneToMany(() => Hierarchy, (oemHierarchies) => oemHierarchies.hierarchyLevel)
  hierarchies: Hierarchy[];

  @ManyToOne(() => Company, (oemCompanies) => oemCompanies.hierarchyLevels)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;
}

export { HierarchyLevel as OemHierarchyLevelEntity };
