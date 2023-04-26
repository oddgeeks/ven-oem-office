import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemVendosMaterials } from '../../intermediaries/_oem-vendos-materials/oem-vendos-materials.entity';
import { OemQuotesMaterials } from '../../intermediaries/_oem-quotes-materials/oem-quotes-materials.entity';
import { PackagePositionEnum } from './oem-material.enums/package-position.enum';
import { ApplicableToEnum } from './oem-material.enums/applicable-to.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_materials_pkey', ['materialId'], { unique: true })
@Entity('oem_materials', { schema: 'oem' })
export class Material {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'material_id' })
  materialId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', { name: 'material_name', length: 512 })
  materialName: string;

  @Column('character varying', { name: 'file_url', length: 1024 })
  fileUrl: string;

  @Column('boolean', { name: 'is_required' })
  isRequired: boolean;

  @Column('enum', {
    name: 'package_position',
    enum: PackagePositionEnum,
  })
  packagePosition: PackagePositionEnum;

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

  @Column('enum', { name: 'applicable_to', enum: ApplicableToEnum })
  applicableTo: ApplicableToEnum;

  @OneToMany(
    () => OemQuotesMaterials,
    (oemQuotesMaterials) => oemQuotesMaterials.material,
  )
  quotesMaterials: OemQuotesMaterials[];

  @OneToMany(
    () => OemVendosMaterials,
    (oemVendosMaterials) => oemVendosMaterials.material,
  )
  vendosMaterials: OemVendosMaterials[];
}

export { Material as OemMaterialEntity };
