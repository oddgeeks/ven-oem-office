import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemQuotesMaterials } from '../intermediaries/_oem-quotes-materials/oem-quotes-materials.entity';

export default class CreateOemQuotesMaterials implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const quoteMaterial1 = await factory(OemQuotesMaterials)().create({
      materialId: 1,
    });
    const quoteMaterial2 = await factory(OemQuotesMaterials)().create({
      materialId: 2,
    });
    return [quoteMaterial1, quoteMaterial2];
  }
}
