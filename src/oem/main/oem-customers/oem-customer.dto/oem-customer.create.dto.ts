import { OmitType } from '@nestjs/swagger';
import { OemCustomerDto } from './oem-customer.dto';
import { Customer } from '../oem-customer.entity';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CustomerCreateDto extends OmitType(OemCustomerDto, [
  'isEnabled',
  'createdAt',
  'updatedAt',
  'customersProducts',
  'companyId',
  'vendos',
  'customerAddresses',
] as const) {
  constructor(data: Partial<Customer> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { CustomerCreateDto as OemCustomerCreateDto };
