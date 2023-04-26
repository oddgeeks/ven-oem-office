import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesProductsService } from './oem-quotes-products.service';
import { OemQuotesProducts } from './oem-quotes-products.entity';
import { dto } from './oem-quotes-products.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesProducts,
  },
  params: {
    id: {
      field: 'quoteProductId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      quote: {
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
      'product.pricingModel': {
        eager: false,
      },
      'product.pricingModel.unitTiers': {
        eager: false,
      },
      'product.priceTiers': {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
  dto,
})
@ApiTags('Quotes')
@Controller('/quote-products/')
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
export class OemQuotesProductsController
  implements CrudController<OemQuotesProducts>
{
  constructor(public service: OemQuotesProductsService) {}

  get base(): CrudController<OemQuotesProducts> {
    return this;
  }
}
