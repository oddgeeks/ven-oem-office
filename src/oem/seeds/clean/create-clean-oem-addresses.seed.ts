import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';
import { AddressTypeEnum } from '../../main/oem-addresses/oem-address.enums/address-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemAddresses implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const addresses: Partial<OemAddressEntity>[] = [
        {
          address_1: 'Suite 370',
          address_2: 'Suite 060',
          address_3: 'Apt. 859',
          city: 'Laverneburgh',
          zipCode: '43922',
          region: 'New York',
          country: 'Borders',
          phone: '+1 929 276-6530',
          email: 'Bette.Rath41@gmail.com',
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.SHIPPING,
        },
        {
          address_1: 'Apt. 841',
          address_2: 'Apt. 487',
          address_3: 'Suite 403',
          city: 'Olathe',
          zipCode: '50518',
          region: 'Hawaii',
          country: 'Bedfordshire',
          phone: '+1 929 277-3626',
          email: 'Effie18@hotmail.com',
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.BILLING,
        },
        {
          address_1: 'Apt. 105',
          address_2: 'Suite 278',
          address_3: 'Suite 921',
          city: 'Marvinfort',
          zipCode: '21200-6337',
          region: 'Alaska',
          country: 'Bedfordshire',
          phone: '+1 929 279-4151',
          email: 'Bailey_Hamill77@gmail.com',
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.SHIPPING,
        },
        {
          address_1: '70 SW Century Dr #1019 Bend OR 97702',
          address_2: null,
          address_3: 'null',
          city: 'New York City',
          zipCode: '97702',
          region: 'OR',
          country: 'United States',
          phone: '929-248-0000',
          email: null,
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.BILLING,
        },
        {
          address_1: '70 SW Century Dr #1019 Bend OR 97702',
          address_2: null,
          address_3: 'null',
          city: 'New York City',
          zipCode: '97702',
          region: 'OR',
          country: 'United States',
          phone: '929-248-0000',
          email: null,
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.SHIPPING,
        },
        {
          address_1: '1 Main Street',
          address_2: 'Apt. 101',
          address_3: 'null',
          city: 'Springfield',
          zipCode: '12345',
          region: 'Georgia',
          country: 'United States',
          phone: '+1 (123) 456-7890',
          email: 'info@democo.com',
          isEnabled: true,
          companyId,
          addressType: AddressTypeEnum.BILLING,
        },
      ];

      const addressEntities = await seedEntities(
        connection,
        OemAddressEntity,
        addresses,
      );

      return addressEntities;
    }
  };
