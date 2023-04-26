import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { RelationshipTypeEnum } from '../oem-products-relationships.enums/relationship-type.enum';
import { EligibleTypeEnum } from '../oem-products-relationships.enums/eligible-type.enum';
import { ListPriceTypeEnum } from '../oem-products-relationships.enums/list-price-type.enum';

export class ProductsRelationshipsDto {
  /**
   * The id of Product Source
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  sourceProductId: number;

  /**
   * The id of Product Target
   * @example 2
   */
  @IsNumber()
  @IsNotEmpty()
  targetProductId: number;

  /**
   * The relationship type
   * @example Transition
   */
  @IsEnum(RelationshipTypeEnum)
  @IsNotEmpty()
  relationshipType: RelationshipTypeEnum;

  /**
   * The eligible type
   * @example Upgrade
   */
  @IsEnum(EligibleTypeEnum)
  @IsNotEmpty()
  eligibleType: EligibleTypeEnum;

  /**
   * The list price type
   * @example Full List Price
   */
  @IsEnum(ListPriceTypeEnum)
  @IsOptional()
  listPriceType: ListPriceTypeEnum;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

export { ProductsRelationshipsDto as OemProductsRelationshipsDto };
