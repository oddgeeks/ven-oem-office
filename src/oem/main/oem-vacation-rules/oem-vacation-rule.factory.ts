import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { OemVacationRule } from './oem-vacation-rule.entity';

interface Context {
  companyId: number;
  name?: string;
  sourceUserId?: number;
  targetUserId?: number;
}

define(OemVacationRule, (faker_, context: Context) => {
  const vacationRule: OemVacationRule = new OemVacationRule();

  vacationRule.companyId = context?.companyId || 1;
  vacationRule.name = context?.name || faker.word.noun();
  vacationRule.sourceUserId = context?.sourceUserId || 1;
  vacationRule.targetUserId = context?.targetUserId || 2;

  return vacationRule;
});
