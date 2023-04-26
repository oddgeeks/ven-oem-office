import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemDiscountEntity } from '../main/oem-discounts/oem-discount.entity';

export default class CreateOemDiscounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemDiscountEntity)().create();
  }
}
