import { define } from 'typeorm-seeding';
import { QuotesMaterials } from './oem-quotes-materials.entity';
import { faker } from '@faker-js/faker';

define(QuotesMaterials, () => {
  const quotesMaterials: QuotesMaterials = new QuotesMaterials();
  quotesMaterials.quoteId = 1;
  quotesMaterials.materialId = 1;
  quotesMaterials.position = 1;
  quotesMaterials.companyId = 1;
  return quotesMaterials;
});
