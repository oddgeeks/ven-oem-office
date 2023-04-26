import { VendoDto } from './oem-vendo.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoSerializeDto extends VendoDto {}

export { VendoSerializeDto as OemVendoSerializeDto };
