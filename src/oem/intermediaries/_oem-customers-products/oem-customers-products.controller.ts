import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemCustomersProductsService } from './oem-customers-products.service';
import { OemCustomersProducts } from './oem-customers-products.entity';
import { dto } from './oem-customers-products.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemCustomersProducts,
  },
  params: {
    id: {
      field: 'customerProductId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      customer: {
        eager: false,
      },
      product: {
        eager: false,
      },
      bundle: {
        eager: false,
      },
      'bundle.products': {
        eager: false,
      },
    },
  },
  routes: {
    only: [
      'createOneBase',
      'replaceOneBase',
      'deleteOneBase',
      'getManyBase',
      'getOneBase',
    ],
  },
  dto,
})
@ApiTags('Products')
@Controller('/customer-products/')
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
export class OemCustomersProductsController
  implements CrudController<OemCustomersProducts>
{
  constructor(public service: OemCustomersProductsService) {}
}
