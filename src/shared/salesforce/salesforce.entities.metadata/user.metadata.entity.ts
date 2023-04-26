import { Column } from 'typeorm';

/*@Entity()*/
export class SfUserMetadataEntity {
  @Column('character varying', {
    name: 'sf_user_id',
    nullable: true,
    length: 24,
  })
  sfUserId: string | null;
}
