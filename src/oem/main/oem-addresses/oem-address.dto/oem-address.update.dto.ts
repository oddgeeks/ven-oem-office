import { OmitType } from '@nestjs/swagger';
import { OemAddressDto } from './oem-address.dto';
import { OemAddressEntity } from '../oem-address.entity';
import { IsEnum, IsOptional } from 'class-validator';
import { AddressTypeEnum } from '../oem-address.enums/address-type.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class AddressUpdateDto extends OmitType(OemAddressDto, [
  'addressId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'companyId',
] as const) {
  @IsOptional()
  address_1: string | null;

  @IsOptional()
  address_2: string | null;

  @IsOptional()
  address_3: string | null;

  @IsOptional()
  companyId: number;

  @IsOptional()
  city: string;

  @IsOptional()
  zipCode: string;

  @IsOptional()
  region: string;

  @IsOptional()
  country: string;

  @IsOptional()
  phone: string | null;

  @IsOptional()
  email: string | null;

  /* @IsOptional()
   isBilling: boolean;

   @IsOptional()
   isShipping: boolean;*/
  @IsOptional()
  addressType: AddressTypeEnum;
}

export { AddressUpdateDto as OemAddressUpdateDto };
