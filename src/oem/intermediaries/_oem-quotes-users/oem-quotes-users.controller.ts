import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesUsers } from './oem-quotes-users.entity';
import { OemQuotesUsersService } from './oem-quotes-users.service';
import { dto, serialize } from './oem-quotes-users.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesUsers,
  },
  params: {
    id: {
      field: 'quoteId',
      type: 'number',
    },
    userId: {
      field: 'userId',
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
        eager: true,
      },
      'user.role': { alias: 'role' },
      'user.company': { alias: 'userCompany' },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
    // Users are not replaced properly. Live example:
    // • PUT /quotes/125/users/8
    // • Always returns a user with an 1d of 4
    //
    // replaceOneBase: {
    //   allowParamsOverride: true
    // },
  },
  dto,
  serialize,
})
@ApiTags('Quotes')
@Controller('/quotes/:id/users/')
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
export class OemQuotesUsersController
  implements CrudController<OemQuotesUsers>
{
  constructor(public service: OemQuotesUsersService) {}

  get base(): CrudController<OemQuotesUsers> {
    return this;
  }
}
