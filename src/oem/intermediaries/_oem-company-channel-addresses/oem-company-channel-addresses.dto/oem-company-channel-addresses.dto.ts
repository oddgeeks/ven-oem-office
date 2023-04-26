import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CompanyChannelAddressDto {
  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  companyId: number;

  /**
   * The id of Company Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyChannelId: number;

  /**
   * The id of Channel
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  channelId: number;

  /**
   * The id of Address
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  addressId: number;
}

export { CompanyChannelAddressDto as OemCompanyChannelAddressesDto };
