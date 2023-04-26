import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemRecentlyViewedQuotesVendos } from './oem-recently-viewed-quotes-vendos.entity';
import { OemRecentlyViewedQuotesVendosService } from './oem-recently-viewed-quotes-vendos.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { DataAccessInterceptor } from '../../../auth/roles/interceptors/data-access.interceptor';

@Crud({
  model: {
    type: OemRecentlyViewedQuotesVendos,
  },
  params: {
    id: {
      field: 'recentlyViewedId',
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
      'quote.customer': {
        eager: false,
      },
      vendo: {
        eager: false,
      },
      'vendo.customer': {
        eager: false,
      },
    },
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiTags('Quotes')
@Controller('recently-viewed-quotes-vendos')
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
@UseInterceptors(InjectSubHierarchyInterceptor, DataAccessInterceptor)
@SetCurrentUser
export class OemRecentlyViewedQuotesVendosController
  implements CrudController<OemRecentlyViewedQuotesVendos>
{
  constructor(public service: OemRecentlyViewedQuotesVendosService) {}
}
