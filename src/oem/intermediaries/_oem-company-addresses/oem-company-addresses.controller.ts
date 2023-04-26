import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemCompanyAddressesService } from './oem-company-addresses.service';
import {
  CompanyAddresses,
  OemCompanyAddressesEntity,
} from './oem-company-addresses.entity';
import { dto, serialize } from './oem-company-addresses.dto';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: CompanyAddresses,
  },
  params: {
    id: {
      field: 'companyId',
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
      address: {
        eager: false,
      },
      company: {
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
@ApiTags('Company')
@Controller('/companies/:id/addresses/')
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
export class OemCompanyAddressesController
  implements CrudController<OemCompanyAddressesEntity>
{
  constructor(public service: OemCompanyAddressesService) {}
}
