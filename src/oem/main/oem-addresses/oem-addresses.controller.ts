import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemAddressesService } from './oem-addresses.service';
import { OemAddressEntity } from './oem-address.entity';

import { dto, serialize } from './oem-address.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemAddressEntity,
  },
  params: {
    addressId: {
      field: 'addressId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@ApiBearerAuth('JWT-auth')
@ApiTags('Addresses')
@Controller('addresses')
@SetCurrentUser
export class OemAddressesController
  implements CrudController<OemAddressEntity>
{
  constructor(public service: OemAddressesService) {}
}
