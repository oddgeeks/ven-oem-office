import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { OemCustomersProducts } from '../../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { Type } from 'class-transformer';
import { OemVendoEntity } from '../../oem-vendos/oem-vendo.entity';
import { OemAddressEntity } from '../../oem-addresses/oem-address.entity';

export class CustomerDto {
  /**
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Licensing Program
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  licensingProgramId: number;

  /**
   * The id of organization
   * @example 1
   */
  @IsString()
  organizationId: string | null;

  /**
   * The id of sales organization
   * @example 1
   */
  @IsString()
  salesOrganizationId: string | null;

  /**
   * The name of customer
   * @example VE-1
   */
  @IsString()
  @IsNotEmpty()
  customerName: string;

  /**
   * The industry of customer
   * @example VE-1
   */
  @IsString()
  industry: string;

  /**
   * The email of customer
   * @example VE-1
   */
  @IsString()
  @IsOptional()
  customerEmail: string | null;

  /**
   * The logo URL
   * @example "https://files.vendori.com/logo.png"
   */
  @IsString()
  @IsUrl()
  @IsOptional()
  logoUrl: string | null;

  /**
   * The phone
   * @example +1 929 279-9165
   */
  @IsString()
  //@IsPhoneNumber()
  phone: string | null;

  /**
   * The enabled
   * @example 1
   */
  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;

  /**
   * The date of creating customer.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating customer.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The array of customers products
   * @example []
   */
  @IsArray()
  @Type(() => OemCustomersProducts)
  customersProducts: OemCustomersProducts[];

  /**
   * The array of vendos
   * @example []
   */
  @IsArray()
  @Type(() => OemVendoEntity)
  vendos: OemVendoEntity[];

  /**
   * The addresses
   * @example addresses
   */
  @Type(() => OemAddressEntity)
  customerAddresses: OemAddressEntity[];
}

export { CustomerDto as OemCustomerDto };
