import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemCompanyChannelAddressesService } from './oem-company-channel-addresses.service';
import { OemCompanyChannelAddresses } from './oem-company-channel-addresses.entity';
import { dto, serialize } from './oem-company-channel-addresses.dto';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: OemCompanyChannelAddresses,
  },
  params: {
    id: {
      field: 'channelId',
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
      channel: {
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
@ApiTags('Channels')
@Controller('/company-channels/:id/addresses/')
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
export class OemCompanyChannelAddressesController
  implements CrudController<OemCompanyChannelAddresses>
{
  constructor(public service: OemCompanyChannelAddressesService) {}
}
