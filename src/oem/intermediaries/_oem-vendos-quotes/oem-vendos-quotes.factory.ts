import { define } from 'typeorm-seeding';

import { VendosQuotes } from './oem-vendos-quotes.entity';

interface Context {
  vendoId: number;
  quoteId: number;
  companyId: number;
  isEnabled: boolean;
  isLocked: boolean;
  lockedFields: object;
}

define(VendosQuotes, (faker_, context?: Context) => {
  const vendoQuotes = new VendosQuotes();
  vendoQuotes.companyId = context?.companyId || 1;
  vendoQuotes.quoteId = context?.quoteId || 1;
  vendoQuotes.isLocked = context?.isLocked || false;
  vendoQuotes.lockedFields = context?.lockedFields || {};
  return vendoQuotes;
});
