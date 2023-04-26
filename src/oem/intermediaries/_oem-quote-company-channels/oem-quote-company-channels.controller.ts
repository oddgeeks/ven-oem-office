import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemQuoteCompanyChannel } from './oem-quote-company-channel.entity';
import { OemQuoteCompanyChannelsService } from './oem-quote-company-channels.service';
import { dto, serialize } from './oem-quote-company-channel.dto.ts';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuoteCompanyChannel,
  },
  params: {
    id: {
      field: 'quoteId',
      type: 'number',
    },
    companyChannelId: {
      field: 'companyChannelId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      quote: {
        eager: false,
      },
      companyChannel: {
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
@ApiTags('Quotes')
@Controller(`quotes/:id/company-channels`)
export class OemQuoteCompanyChannelsController
  implements CrudController<OemQuoteCompanyChannel>
{
  constructor(public service: OemQuoteCompanyChannelsService) {}
}
