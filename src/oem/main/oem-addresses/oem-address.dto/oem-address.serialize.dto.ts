import { OemAddressDto } from './oem-address.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class AddressSerializeDto extends PartialType(OemAddressDto) {}

export { AddressSerializeDto as OemAddressSerializeDto };
