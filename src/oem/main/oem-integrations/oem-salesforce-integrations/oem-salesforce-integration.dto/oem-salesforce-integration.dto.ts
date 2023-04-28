import { OemSalesforceIntegrationEntity } from '../oem-salesforce-integration.entity';
import { PublicPart } from '../../../../../utils/public-part-type.util';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsObject,
  IsOptional,
} from 'class-validator';

export class SalesforceIntegrationDto
  implements PublicPart<OemSalesforceIntegrationEntity>
{
  /**
   * The Salesforce Integration
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  salesforceIntegrationId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The Salesforce Client Id
   * @example 3216gh1j23bjvb
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  salesforceClientId: string;

  /**
   * The Salesforce Client Secret
   * @example gjhqdbjkg673g7321312
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  salesforceClientSecret: string;

  /**
   * The Salesforce Password
   * @example gjhqdbjkg673g7321312
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  salesforcePassword: string;

  /**
   * The Salesforce URL
   * @example https://vendori-dev-ed.lightning.force.com
   */
  @IsUrl()
  @MaxLength(128)
  salesforceURL: string;

  /**
   * The setting fields
   * @example {
      "endDate": "2023-04-20T00:00:00.000Z",
      "isRequired": true,
      "pricebookId": "006DN000002ImxnYAC",
      "renewalDate": "2023-04-11T11:16:33.578Z",
      "feedbackType": "",
      "renewalAmount": 1000,
      "renewalStages": "Test",
      "renewalRecordType": "Test2",
      "nonRenewalProducts": "Defaulted",
      "renewalAutoCreation": "Right Away",
      "defaultAmendmentDate": "2023-04-11T11:16:33.578Z",
      "renewalOppNameFormat": "2023-04-11T11:16:33.578Z",
      "renewalOpportunityId": "006DN000002ImxnYAC",
      "renewalUpliftPercent": "Test",
      "originalOpportunityId": "006DN000002ImxnYAC",
      "renewalUpliftLocation": "None",
      "lastAmendmentOpportunityId": "006DN000002ImxnYAC",
      "renewalOpportunityProductId": "006DN000002ImxnYAC",
      "renewalOwnershipFiledLookup": "Account Team_ Renewal Owner",
      "originalOpportunityProductId": "006DN000002ImxnYAC",
      "contractedRenewalOverrideFiled": "Test",
      "defaultQuoteAutoExpirationDate": "2023-04-11T11:16:33.578Z",
      "productRenewalDateNotification": "Test",
      "isPushAssetsToSalesforceChecked": true,
      "isSyncTermsAndConditionsChecked": true,
      "lastAmendmentOpportunityProductId": "006DN000002ImxnYAC",
      "isBypassBundlePreservationRulesChecked": true
    }
   */
  @IsObject()
  @IsOptional()
  settings: object;

  /**
   * The Salesforce Username
   * @example test@vendori.com
   */
  @MaxLength(128)
  salesforceUsername: string;

  /**
   * The last 4 symbols of Client Secret
   * @example test@vendori.com
   */
  @MaxLength(4)
  @MinLength(4)
  salesforceClientSecretLast4: string;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * Is enable
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;
}

export { SalesforceIntegrationDto as OemSalesforceIntegrationDto };
