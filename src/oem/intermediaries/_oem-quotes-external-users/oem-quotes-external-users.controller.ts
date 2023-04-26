import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesExternalUsers } from './oem-quotes-external-users.entity';
import { OemQuotesExternalUsersService } from './oem-quotes-external-users.service';
import { dto, serialize } from './oem-quotes-external-users.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesExternalUsers,
  },
  params: {
    id: {
      field: 'quoteId',
      type: 'number',
    },
    userId: {
      field: 'externalUserId',
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
      company: { eager: false },
      user: {
        eager: false,
      },
      'user.company': { alias: 'userCompany' },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Quotes')
@Controller('/quotes/:id/external-users/')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@ApiBearerAuth('JWT-auth')
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
export class OemQuotesExternalUsersController
  implements CrudController<OemQuotesExternalUsers>
{
  constructor(public service: OemQuotesExternalUsersService) {}

  get base(): CrudController<OemQuotesExternalUsers> {
    return this;
  }
}
