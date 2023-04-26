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
import { Quote } from '../../main/oem-quotes/oem-quote.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_quotes_materials_material_id_idx', ['materialId'], {})
@Index('oem_quotes_materials_quote_id_idx', ['quoteId'], {})
@Entity('oem_quotes_materials', { schema: 'oem' })
@Check(`"position" <> 0`)
export class QuotesMaterials {
  constructor(data: Partial<QuotesMaterials> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({ type: 'integer', name: 'quote_id' })
  quoteId: number;

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

  @ManyToOne(() => Material, (oemMaterials) => oemMaterials.quotesMaterials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'material_id', referencedColumnName: 'materialId' }])
  material: Material;

  @ManyToOne(() => Quote, (oemQuotes) => oemQuotes.quotesMaterials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: Quote;
}

export { QuotesMaterials as OemQuotesMaterials };
