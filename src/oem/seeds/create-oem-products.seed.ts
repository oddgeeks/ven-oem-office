import { Factory, Seeder } from 'typeorm-seeding';
import { OemProductEntity } from '../main/oem-products/oem-product.entity';
import { Connection } from 'typeorm';
import { ProductAvailabilityEnum } from '../main/oem-products/oem-product.enums/product-availability.enum';

export default class CreateOemProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    const products = [];
    products[0] = await factory(OemProductEntity)().create({
      productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
    });
    products[1] = await factory(OemProductEntity)().create({
      productAvailability: [ProductAvailabilityEnum.ADD_ON_UPGRADE_DOWNGRADE],
    });
    await factory(OemProductEntity)().createMany(5);

    return products;
  }
}
