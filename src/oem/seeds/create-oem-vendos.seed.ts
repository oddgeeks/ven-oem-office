import { Factory, Seeder } from 'typeorm-seeding';
import { OemVendoEntity } from '../main/oem-vendos/oem-vendo.entity';
import { Connection } from 'typeorm';

export default class CreateOemVendos implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemVendoEntity)().create({ companyId: 1 });
  }
}
