import { define } from 'typeorm-seeding';
import { PriceTier } from './oem-price-tier.entity';

interface Context {
  companyId?: number;
  unitTierId?: number;
  productId?: number;
  cogsUnit?: number;
  priceUnit?: number;
}

define(PriceTier, (faker_, context: Context) => {
  const priceTier = new PriceTier();

  priceTier.companyId = context?.companyId || 1;
  priceTier.unitTierId = context?.unitTierId || 1;
  priceTier.productId = context?.productId || 1;
  priceTier.cogsUnit = context?.cogsUnit || 346;
  priceTier.priceUnit = context?.priceUnit || 100;

  return priceTier;
});
