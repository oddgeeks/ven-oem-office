import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesCustomerProductsService } from './oem-quotes-customer-products.service';
import { OemQuotesCustomerProducts } from './oem-quotes-customer-products.entity';
import { dto } from './oem-quotes-customer-products.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesCustomerProducts,
  },
  params: {
    id: {
      field: 'quoteId',
      type: 'number',
    },
    customerProductId: {
      field: 'customerProductId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      quote: {
        eager: false,
      },
      customerProduct: {
        eager: false,
      },
      'customerProduct.product': {
        eager: false,
      },
      'customerProduct.product.pricingModel': {
        eager: false,
      },
      'customerProduct.product.pricingModel.unitTiers': {
        eager: false,
      },
      'customerProduct.product.priceTiers': {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'deleteOneBase'],
  },
  dto,
})
@ApiTags('Quotes')
@Controller('/quotes/:id/customer-products/')
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
export class OemQuotesCustomerProductsController
  implements CrudController<OemQuotesCustomerProducts>
{
  constructor(public service: OemQuotesCustomerProductsService) {}

  get base(): CrudController<OemQuotesCustomerProducts> {
    return this;
  }

  @ApiOkResponse({
    description: 'Deleted quote customer product.',
  })
  @ApiOperation({
    summary: 'Delete a single QuotesCustomerProducts',
  })
  @Delete('/:customerProductId')
  @ApiParam({
    name: 'customerProductId',
    schema: {
      type: 'number',
    },
  })
  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  async deleteOne(@Param() params) {
    return this.service.disableOne(params);
  }
}
