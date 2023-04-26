import { Column } from 'typeorm';
import { MetadataEntity } from '../../../common/entities/metadata.entity';

/*@Entity()*/
export class SfProductMetadataEntity extends MetadataEntity {
  @Column({
    type: 'character varying',
    name: 'sf_product_id',
    nullable: true,
    default: null,
  })
  sfProductId: string | null;

  @Column({
    type: 'character varying',
    name: 'sf_price_book_id',
    nullable: true,
    default: null,
  })
  sfPriceBookId: string | null;

  @Column({
    type: 'character varying',
    name: 'display_url',
    nullable: true,
    default: null,
  })
  displayUrl: string | null;

  @Column({
    type: 'integer',
    name: 'last_modifier_user_id',
    nullable: true,
    default: null,
  })
  lastModifierUserId: number | null;

  @Column({
    type: 'character varying',
    name: 'product_description',
    nullable: true,
    default: null,
  })
  productDescription: string | null;

  @Column('character varying', {
    name: 'product_code',
    length: 64,
    nullable: true,
    default: null,
  })
  productCode: string;
}
