import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemProductsRelationshipsService } from './oem-products-relationships.service';
import { OemProductsRelationships } from './oem-products-relationships.entity';
import { dto } from './oem-products-relationships.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemProductsRelationships,
  },
  params: {
    id: {
      field: 'productRelationshipId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      sourceBundle: {
        eager: false,
      },
      targetBundle: {
        eager: false,
      },
      sourceProduct: {
        eager: false,
      },
      targetProduct: {
        eager: false,
      },
      'targetProduct.pricingModel': {
        eager: false,
        alias: 'targetPricingModel',
      },
      'sourceProduct.pricingModel': {
        eager: false,
        alias: 'sourcePricingModel',
      },
      'targetBundle.products': {
        eager: false,
        alias: 'targetBundleProducts',
      },
      'sourceBundle.products': {
        eager: false,
        alias: 'sourceBundleProducts',
      },
      'targetProduct.products': {
        eager: false,
        alias: 'targetProducts',
      },
      'sourceProduct.products': {
        eager: false,
        alias: 'sourceProducts',
      },
    },
  },
  routes: {
    replaceOneBase: {
      allowParamsOverride: true,
    },
  },
  dto,
})
@ApiTags('Products')
@Controller('/product-transitions')
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
@SetController([CloneCrudController, DeleteCrudController])
export class OemProductsRelationshipsController
  implements CrudController<OemProductsRelationships>
{
  constructor(public service: OemProductsRelationshipsService) {}
}
