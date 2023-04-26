import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemCompanyChannel } from './oem-company-channel.entity';
import { OemCompanyChannelsService } from './oem-company-channels.service';
import { dto, serialize } from './oem-company-channel.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemCompanyChannel,
  },
  params: {
    id: {
      field: 'companyChannelId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      company: {
        eager: false,
      },
      companyChannelSetting: {
        eager: false,
      },
      'companyChannelSetting.channel': {
        eager: false,
      },
      companyChannelAddresses: {
        eager: false,
      },
      'companyChannelAddresses.address': {
        eager: false,
      },
      geoHierarchy: {
        eager: false,
      },
      companyProgram: {
        eager: false,
      },
      users: {
        eager: false,
      },
    },
  },
  routes: {},
  dto,
  serialize,
})
@ApiTags('Channels')
@Controller('company-channels')
@ApiBearerAuth('JWT-auth')
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
@SetCurrentUser
export class OemCompanyChannelsController
  implements CrudController<OemCompanyChannel>
{
  constructor(public service: OemCompanyChannelsService) {}
}
