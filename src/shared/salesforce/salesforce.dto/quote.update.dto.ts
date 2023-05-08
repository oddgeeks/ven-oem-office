import { IsNotEmpty, IsString } from 'class-validator';
export class QuoteSalesforceUpdateDto {
  /**
   * The salesforce contract id
   * @example 800DN0000000QcVYAU
   */
  @IsNotEmpty()
  @IsString()
  sfContractId: string;
}
