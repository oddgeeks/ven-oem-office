import { OemCustomerDto } from './oem-customer.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CustomerSerializeDto extends PartialType(OemCustomerDto) {}

export { CustomerSerializeDto as OemCustomerSerializeDto };
