import { define } from 'typeorm-seeding';

import { OemCompanyProgram } from './oem-company-program.entity';

interface Context {
  companyId?: number;
  channelId?: number;
  name?: string;
}

define(OemCompanyProgram, (faker_, context: Context) => {
  const companyProgram = new OemCompanyProgram();

  companyProgram.companyId = context?.companyId || 1;
  companyProgram.channelId = context?.channelId || 1;
  companyProgram.name = context?.name || 'NA';

  return companyProgram;
});
