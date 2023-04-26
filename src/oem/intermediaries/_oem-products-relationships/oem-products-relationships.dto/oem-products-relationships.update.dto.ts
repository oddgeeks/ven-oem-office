import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { RelationshipTypeEnum } from '../oem-products-relationships.enums/relationship-type.enum';
import { EligibleTypeEnum } from '../oem-products-relationships.enums/eligible-type.enum';
import { OemProductsRelationshipsDto } from './oem-products-relationships.dto';

export class ProductsRelationshipsUpdateDto extends OmitType(
  OemProductsRelationshipsDto,
  ['sourceProductId', 'targetProductId'],
) {
  @IsOptional()
  relationshipType: RelationshipTypeEnum;

  @IsOptional()
  eligibleType: EligibleTypeEnum;

  @IsOptional()
  isActive: boolean;
}

export { ProductsRelationshipsUpdateDto as OemProductsRelationshipsUpdateDto };
