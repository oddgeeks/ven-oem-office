import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemDiscountRuleEntity } from '../main/oem-rules/oem-discount-rules/oem-discount-rule.entity';

export default class CreateOemDiscountRules implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemDiscountRuleEntity)().create();
  }
}
