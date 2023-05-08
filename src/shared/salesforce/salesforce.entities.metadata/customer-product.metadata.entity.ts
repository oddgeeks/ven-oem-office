import { Column } from 'typeorm';
import { MetadataEntity } from '../../../common/entities/metadata.entity';

/*@Entity()*/
export class SfCustomerProductMetadataEntity extends MetadataEntity {
  @Column('character varying', {
    name: 'sf_parent_asset_id',
    nullable: true,
    default: null,
  })
  sfParentAssetId: string | null;

  @Column('character varying', {
    name: 'sf_asset_id',
    nullable: true,
    default: null,
  })
  sfAssetId: string | null;
}
