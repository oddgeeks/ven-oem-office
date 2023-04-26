import { OmitType } from '@nestjs/swagger';
import { OemAddressDto } from './oem-address.dto';
import { OemAddressEntity } from '../oem-address.entity';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class AddressCreateDto extends OmitType(OemAddressDto, [
  'addressId',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {
  constructor(data: Partial<OemAddressEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { AddressCreateDto as OemAddressCreateDto };
