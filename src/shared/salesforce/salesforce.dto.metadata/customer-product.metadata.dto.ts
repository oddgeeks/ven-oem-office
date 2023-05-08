import { IsOptional, IsString } from 'class-validator';

// TODO: Move all metadata to a general integration table @saleforce_sync
// Map general salesforce id value, property name, vendori id value,
// integration_type salesforce (or hubspot etc), type_subject entity (Quote)
// Same for all models, not just users.
// Use the integration table as the primary entity and join relationships based on it.
export class SfCustomerProductMetadataDto {
  /**
   * The salesforce parent asset id
   * @example 02iDN00000057GBYAY
   */
  @IsString()
  @IsOptional()
  sfParentAssetId: string | null;

  /**
   * The salesforce asset id
   * @example 02iDN00000057GBYAY
   */
  @IsString()
  @IsOptional()
  sfAssetId: string | null;
}
