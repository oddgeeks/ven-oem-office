import { define } from 'typeorm-seeding';

import { QuotesExternalUsers } from './oem-quotes-external-users.entity';
import { QuoteUserTypeEnum } from './oem-quotes-external-users.enums/quote-user-type.enum';

interface Context {
  companyId?: number;
  userId?: number;
  quoteId?: number;
  isOwner?: boolean;
  isApprover?: boolean;
  type?: QuoteUserTypeEnum;
}

define(QuotesExternalUsers, (faker_, context: Context) => {
  const quotesUsers = new QuotesExternalUsers();

  quotesUsers.companyId = context?.companyId || 1;
  quotesUsers.externalUserId = context?.userId || 1;
  quotesUsers.quoteId = context?.quoteId || 1;
  quotesUsers.isOwner = context?.isOwner || true;
  quotesUsers.isApprover = context?.isApprover || true;
  quotesUsers.type = context?.type || QuoteUserTypeEnum.INTERNAL;

  return quotesUsers;
});
