import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { OemVendosUsers } from './oem-vendos-users.entity';
import { OemVendosUsersService } from './oem-vendos-users.service';
import { dto, serialize } from './oem-vendos-users.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { AuthUser } from '../../main/oem-users/oem-users.decorators/auth-user.decorator';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';

@Crud({
  model: {
    type: OemVendosUsers,
  },
  params: {
    id: {
      field: 'vendoId',
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
      vendo: {
        eager: false,
      },
      user: {
        eager: false,
      },
      'user.role': { alias: 'role' },
      'user.company': { alias: 'userCompany' },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
  },
  dto,
  serialize,
})
@ApiTags('Vendos')
@Controller('/vendos/:id/users/')
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
export class OemVendosUsersController
  implements CrudController<OemVendosUsers>
{
  constructor(public service: OemVendosUsersService) {}

  get base(): CrudController<OemVendosUsers> {
    return this;
  }
}
