import { IsNotEmpty, IsNumber } from 'class-validator';

export class CompanyAddressesDto {
  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Address
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  addressId: number;
}

export { CompanyAddressesDto as OemCompanyAddressesDto };
