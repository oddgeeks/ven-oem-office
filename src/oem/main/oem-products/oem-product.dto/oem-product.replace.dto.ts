import { OmitType } from '@nestjs/swagger';
import { OemProductDto } from './oem-product.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ProductReplaceDto extends OmitType(OemProductDto, [
  'productId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'customersProducts',
  'ownerUser',
  'quotesProducts',
  'productsRelationshipsSource',
  'productsRelationshipsTarget',
  'productHierarchy',
  'pricingModel',
]) {}

export { ProductReplaceDto as OemProductReplaceDto };
