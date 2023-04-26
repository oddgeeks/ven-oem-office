import { define } from 'typeorm-seeding';
import { QuoteAndVendoUuid } from './oem-quote-and-vendo-uuid.entity';
import { UuidTypesEnum } from './oem-quote-and-vendo.enums/uuid-types.enum';

interface Context {
  quoteAndVendoUuidType?: UuidTypesEnum;
  companyId?: number;
  prefix?: string;
  lastUuid?: number;
}

define(QuoteAndVendoUuid, (faker_, context: Context) => {
  const quoteAndVendoUuid = new QuoteAndVendoUuid();

  quoteAndVendoUuid.quoteAndVendoUuidType =
    context?.quoteAndVendoUuidType || UuidTypesEnum.QUOTE;
  quoteAndVendoUuid.companyId = context?.companyId || 1;
  quoteAndVendoUuid.prefix = context?.prefix || 'Q-';
  quoteAndVendoUuid.lastUuid = context?.lastUuid || 1;

  return quoteAndVendoUuid;
});
