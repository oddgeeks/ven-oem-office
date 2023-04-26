import { define } from 'typeorm-seeding';

import { QuotesUsers } from './oem-quotes-users.entity';
import { QuoteUserTypeEnum } from './oem-quotes-users.enums/quoteUserTypeEnum';

interface Context {
  companyId?: number;
  userId?: number;
  quoteId?: number;
  isOwner?: boolean;
  isApprover?: boolean;
  type?: QuoteUserTypeEnum;
}

define(QuotesUsers, (faker_, context: Context) => {
  const quotesUsers = new QuotesUsers();

  quotesUsers.companyId = context?.companyId || 1;
  quotesUsers.userId = context?.userId || 1;
  quotesUsers.quoteId = context?.quoteId || 1;
  quotesUsers.isOwner = context?.isOwner || true;
  quotesUsers.isApprover = context?.isApprover || true;
  quotesUsers.type = context?.type || QuoteUserTypeEnum.INTERNAL;

  return quotesUsers;
});
