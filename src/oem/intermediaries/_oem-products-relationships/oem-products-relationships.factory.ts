import { define } from 'typeorm-seeding';
import { ProductsRelationships } from './oem-products-relationships.entity';
import { RelationshipTypeEnum } from './oem-products-relationships.enums/relationship-type.enum';
import { EligibleTypeEnum } from './oem-products-relationships.enums/eligible-type.enum';
import { ListPriceTypeEnum } from './oem-products-relationships.enums/list-price-type.enum';

define(ProductsRelationships, () => {
  const productsRelationships: ProductsRelationships =
    new ProductsRelationships();
  productsRelationships.sourceProductId = 1;
  productsRelationships.targetProductId = 2;
  productsRelationships.relationshipType = RelationshipTypeEnum.TRANSACTION;
  productsRelationships.eligibleType = EligibleTypeEnum.UPGRADE;
  productsRelationships.listPriceType = ListPriceTypeEnum.FULL_LIST_PRICE;
  productsRelationships.companyId = 1;
  return productsRelationships;
});
