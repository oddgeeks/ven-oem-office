import { IsOptional, IsString, MaxLength } from 'class-validator';

// TODO: Move all metadata to a general integration table @saleforce_sync
// Map general salesforce id value, property name, vendori id value,
// integration_type salesforce (or hubspot etc), type_subject entity (Quote)
// Same for all models, not just users.
// Use the integration table as the primary entity and join relationships based on it.
export class SfUserMetadataDto {
  /**
   * The id of User
   * @example 0065f00000995z2AAA
   */
  @IsOptional()
  sfUserId: string;
}
