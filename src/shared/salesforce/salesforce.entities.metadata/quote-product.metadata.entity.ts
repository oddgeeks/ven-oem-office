import { Column } from 'typeorm';

/*@Entity()*/
export class SfQuoteProductMetadataEntity {
  @Column('character varying', {
    name: 'sf_opportunity_product_id',
    nullable: true,
    default: null,
  })
  sfOpportunityProductId: string | null;
}
