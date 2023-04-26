import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemCustomerAddressesService } from './oem-customer-addresses.service';
import { OemCustomerAddresses } from './oem-customer-addresses.entity';
import { dto, serialize } from './oem-customer-addresses.dto';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: OemCustomerAddresses,
  },
  params: {
    id: {
      field: 'customerId',
      type: 'number',
    },
    addressId: {
      field: 'addressId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      company: {
        eager: false,
      },
      customer: {
        eager: false,
      },
      address: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Customer')
@Controller('/customers/:id/addresses/')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@ApiBearerAuth('JWT-auth')
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
  persist: (req) => ({
    isEnabled: true,
    companyId: req.user.companyId,
  }),
})
@SetCurrentUser
export class OemCustomerAddressesController
  implements CrudController<OemCustomerAddresses>
{
  constructor(public service: OemCustomerAddressesService) {}
}
