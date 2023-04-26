import { Quote } from '../../../oem/main/oem-quotes/oem-quote.entity';
import { Column } from 'typeorm';

/*@Entity()*/
export class SfQuoteMetadataEntity {
  @Column('character varying', {
    name: 'opportunity_id',
    nullable: true,
    length: 36,
    default: null,
  })
  opportunityId: string | null;

  @Column({
    type: 'integer',
    name: 'original_user_id',
    nullable: true,
    default: null,
  })
  originalUserId: number | null;

  @Column({
    type: 'integer',
    name: 'last_modifier_user_id',
    nullable: true,
    default: null,
  })
  lastModifierUserId: number | null;

  @Column({
    type: 'character varying',
    name: 'sf_quote_id',
    nullable: true,
    default: null,
  })
  sfQuoteId: string | null;

  @Column({
    type: 'character varying',
    name: 'sf_contract_id',
    length: 36,
    nullable: true,
    default: null,
  })
  sfContractId: string | null;

  @Column('jsonb', {
    name: 'sf_metadata',
    default: () => `'{}'`,
    nullable: true,
  })
  sfMetaData: Array<object>;

  @Column('boolean', { name: 'is_primary', default: false })
  isPrimary: boolean;
}
