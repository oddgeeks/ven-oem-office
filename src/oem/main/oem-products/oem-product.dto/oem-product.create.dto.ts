import { OmitType } from '@nestjs/swagger';
import { OemProductDto } from './oem-product.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ProductCreateDto extends OmitType(OemProductDto, [
  'productId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'customersProducts',
  'ownerUser',
  'quotesProducts',
  'productsRelationshipsSource',
  'productsRelationshipsTarget',
  'productHierarchy',
  'pricingModel',
]) {}

export { ProductCreateDto as OemProductCreateDto };
