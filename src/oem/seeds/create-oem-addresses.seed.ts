import { Factory, Seeder } from 'typeorm-seeding';
import { OemAddressEntity } from '../main/oem-addresses/oem-address.entity';
import { Connection } from 'typeorm';
import { AddressTypeEnum } from '../main/oem-addresses/oem-address.enums/address-type.enum';

export default class CreateOemAddresses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(OemAddressEntity)().create({
      addressId: 1,
      addressType: AddressTypeEnum.BILLING,
    });
    return await factory(OemAddressEntity)().create({
      addressId: 2,
      addressType: AddressTypeEnum.SHIPPING,
    });
  }
}
