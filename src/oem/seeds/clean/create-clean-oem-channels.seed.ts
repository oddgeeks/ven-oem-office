import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default class CreateCleanOemChannels implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const channels: Partial<OemChannelEntity>[] = [
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Eva's Partner",
        website: 'https://pleasant-zoo.biz',
        contactName: 'Emery',
        contactEmail: 'Telly28@gmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Adalberto's Partner",
        website: 'https://everlasting-sac.biz',
        contactName: 'Travon',
        contactEmail: 'Turner74@hotmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Freda's Partner",
        website: 'https://white-mistake.net',
        contactName: 'Marina',
        contactEmail: 'Shaina.Dare53@hotmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Martine's Partner",
        website: 'https://abandoned-transition.com',
        contactName: 'Jaleel',
        contactEmail: 'Ottilie.Cummings89@gmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Mortimer's Partner",
        website: 'https://tidy-jewel.net',
        contactName: 'Duane',
        contactEmail: 'Hollie_Price54@gmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Serenity's Partner",
        website: 'https://webbed-octave.com',
        contactName: 'Kristopher',
        contactEmail: 'Liam_Stokes@hotmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Shane's Partner",
        website: 'https://wretched-duel.net',
        contactName: 'Sophia',
        contactEmail: 'Samanta.Sipes87@yahoo.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Furman's Partner",
        website: 'https://gentle-torte.net',
        contactName: 'Mustafa',
        contactEmail: 'Elinore49@hotmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Wayne's Partner",
        website: 'http://fatal-inn.name',
        contactName: 'Lolita',
        contactEmail: 'Lucas.Hessel@gmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
      {
        logoUrl: 'http://loremflickr.com/640/480',
        name: "Theresa's Partner",
        website: 'http://swift-corps.biz',
        contactName: 'Myron',
        contactEmail: 'Kenna_Ankunding@hotmail.com',
        contactPhone: '+1 (123) 456-7890',
        isActive: true,
        isEnabled: true,
      },
    ];

    const channelEntities = await seedEntities(
      connection,
      OemChannelEntity,
      channels,
    );

    return channelEntities;
  }
}
