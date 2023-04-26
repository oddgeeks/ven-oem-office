import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { UnitTier } from './oem-unit-tier.entity';

interface Context {
  companyId?: number;
  pricingModelId?: number;
  unitTierName?: string;
  startRange?: number;
  endRange?: number;
}

define(UnitTier, (faker_, context: Context) => {
  const unitTier = new UnitTier();

  unitTier.companyId = context?.companyId || 1;
  unitTier.pricingModelId = context?.pricingModelId || 1;
  unitTier.unitTierName = context?.unitTierName || faker.word.noun();
  unitTier.startRange = context?.startRange || 0;
  unitTier.endRange = context?.endRange || 7;

  return unitTier;
});
