import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Material } from '../../main/oem-materials/oem-material.entity';
import { Vendo } from '../../main/oem-vendos/oem-vendo.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_vendos_materials_material_id_idx', ['materialId'], {})
@Index('oem_vendos_materials_vendo_id_idx', ['vendoId'], {})
@Entity('oem_vendos_materials', { schema: 'oem' })
@Check(`"position" <> 0`)
export class VendosMaterials {
  constructor(data: Partial<VendosMaterials> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @PrimaryColumn({ type: 'integer', name: 'material_id' })
  materialId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('smallint', {
    name: 'position',
  })
  position: number;

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

  @ManyToOne(() => Material, (oemMaterials) => oemMaterials.vendosMaterials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'material_id', referencedColumnName: 'materialId' }])
  material: Material;

  @ManyToOne(() => Vendo, (oemVendos) => oemVendos.vendosMaterials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: Vendo;
}

export { VendosMaterials as OemVendosMaterials };
