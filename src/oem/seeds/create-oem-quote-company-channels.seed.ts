import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemQuoteCompanyChannel } from '../intermediaries/_oem-quote-company-channels/oem-quote-company-channel.entity';

export default class CreateOemQuoteCompanyChannels implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const quoteCompanyChannelReseller = await factory(
      OemQuoteCompanyChannel,
    )().create({
      companyChannelId: 1,
    });
    const quoteCompanyChannelDistributor = await factory(
      OemQuoteCompanyChannel,
    )().create({
      companyChannelId: 2,
    });

    return [quoteCompanyChannelReseller, quoteCompanyChannelDistributor];
  }
}
