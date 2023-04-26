import { define } from 'typeorm-seeding';
import { OemQuoteCompanyChannel } from './oem-quote-company-channel.entity';

define(OemQuoteCompanyChannel, () => {
  const quoteCompanyChannel = new OemQuoteCompanyChannel();

  quoteCompanyChannel.companyId = 1;
  quoteCompanyChannel.quoteId = 1;
  quoteCompanyChannel.companyChannelId = 1;
  quoteCompanyChannel.isActive = true;
  quoteCompanyChannel.isEnabled = true;

  return quoteCompanyChannel;
});
