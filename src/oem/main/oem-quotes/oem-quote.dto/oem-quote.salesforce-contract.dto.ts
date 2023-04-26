import { IsNotEmpty, IsString } from 'class-validator';
export class QuoteSalesforceContractDto {
  /**
   * The salesforce contract id
   * @example 800DN0000000QcVYAU
   */
  @IsNotEmpty()
  @IsString()
  sfContractId: string;
}

/**
 * make more clear for swagger DTO (without OEM prefix)
 * we remove oem prefix form class name due keeping DTO clear in docs, but provided as Oem for keeping context
 */
export { QuoteSalesforceContractDto as OemQuoteSalesforceContractDto };
