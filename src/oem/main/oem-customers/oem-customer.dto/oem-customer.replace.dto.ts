import { OmitType } from '@nestjs/swagger';
import { OemCustomerDto } from './oem-customer.dto';
import { Customer } from '../oem-customer.entity';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CustomerReplaceDto extends OmitType(OemCustomerDto, [
  'customerId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'customersProducts',
  'vendos',
  'customerAddresses',
  'companyId',
] as const) {
  constructor(data: Partial<Customer> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { CustomerReplaceDto as OemCustomerReplaceDto };
