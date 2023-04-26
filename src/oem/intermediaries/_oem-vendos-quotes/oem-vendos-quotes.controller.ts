import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Override } from '@nestjsx/crud';
import { OemVendosQuotesService } from './oem-vendos-quotes.service';
import { OemVendosQuotes } from './oem-vendos-quotes.entity';
import { dto } from './oem-vendos-quotes.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { OemVendosUsers } from '../_oem-vendos-users/oem-vendos-users.entity';

@Crud({
  model: {
    type: OemVendosQuotes,
  },
  params: {
    id: {
      field: 'vendoId',
      type: 'number',
    },
    quoteId: {
      field: 'quoteId',
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
      vendo: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
  },
  dto,
})
@ApiTags('Vendos')
@Controller('/vendos/:id/quotes/')
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
export class OemVendosQuotesController
  implements CrudController<OemVendosQuotes>
{
  constructor(public service: OemVendosQuotesService) {}

  get base(): CrudController<OemVendosQuotes> {
    return this;
  }
}
