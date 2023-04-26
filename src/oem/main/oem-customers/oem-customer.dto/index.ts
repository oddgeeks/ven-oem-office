import { OemCustomerUpdateDto } from './oem-customer.update.dto';
import { OemCustomerCreateDto } from './oem-customer.create.dto';
import { OemCustomerReplaceDto } from './oem-customer.replace.dto';
import { OemCustomerSerializeDto } from './oem-customer.serialize.dto';

export const dto = {
  update: OemCustomerUpdateDto,
  create: OemCustomerCreateDto,
  replace: OemCustomerReplaceDto,
};

export const serialize = {
  get: OemCustomerSerializeDto,
  getMany: OemCustomerSerializeDto,
};
