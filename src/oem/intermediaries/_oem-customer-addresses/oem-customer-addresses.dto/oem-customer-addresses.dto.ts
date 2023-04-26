import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CustomerAddressesDto {
  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  companyId: number;

  /**
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  /**
   * The id of Address
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  addressId: number;
}

export { CustomerAddressesDto as OemCustomerAddressesDto };
