import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SfQuoteMetadataDto {
  /**
   * The id of Opportunity
   * @example 1
   */
  @IsString()
  @IsOptional()
  @MaxLength(36)
  opportunityId: string;

  /**
   * The salesforce contract id. Used to sync assets
   * @example 1
   */
  @IsString()
  @IsOptional()
  @MaxLength(36)
  sfContractId: string;

  /**
   * The locked fields
   * @example {
   *   "AccountId": "0015f00000LihGxAAJ",
   *   "Name": "Test Account",
   *   "Industry": "Technology",
   *   "Phone": "929-248-0000",
   *   "Website": "https://codepen.io",
   *   "PhotoUrl": "/services/images/photo/0015f00000LihGxAAJ",
   *
   *   "BillingStreet": "70 SW Century Dr #1019\r\nBend OR 97702",
   *   "BillingCity": "New York City",
   *   "BillingState": "OR",
   *   "BillingPostalCode": "97702",
   *   "BillingCountry": "-",
   *   "BillingLatitude": null,
   *   "BillingLongitude": null,
   *   "BillingGeocodeAccuracy": null,
   *
   *   "ShippingCity": "New York City",
   *   "ShippingState": "OR",
   *   "ShippingPostalCode": "97702",
   *   "ShippingCountry": "-",
   *   "ShippingLatitude": null,
   *   "ShippingLongitude": null,
   *   "ShippingGeocodeAccuracy": null,
   * }
   */
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  sfMetaData: Array<object>;

  /**
   * If quote is primary
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isPrimary: boolean;
}
