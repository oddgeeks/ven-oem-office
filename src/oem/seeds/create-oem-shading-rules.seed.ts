import { Factory, Seeder } from 'typeorm-seeding';
import { OemShadingRule } from '../main/oem-rules/oem-shading-rules/oem-shading-rule.entity';
import { Connection } from 'typeorm';

export default class CreateOemShadingRulesSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    return await factory(OemShadingRule)().create({ companyId: 1 });
  }
}
