import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemProductEntity } from './oem-product.entity';
import { OemProductsService } from './oem-products.service';
import { dto, serialize } from './oem-product.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemProductEntity,
  },
  params: {
    id: {
      field: 'productId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      quotesProducts: {
        eager: false,
      },
      ownerUser: {
        eager: false,
      },
      customersProducts: {
        eager: false,
      },
      productHierarchy: {
        eager: true,
      },
      pricingModel: {
        eager: false,
      },
      priceTiers: {
        eager: false,
      },
      'priceTiers.unitTier': {
        eager: false,
      },
      productsRelationshipsSources: {
        eager: false,
      },
      'productsRelationshipsSources.targetProduct': {
        eager: false,
      },
    },
  },
  routes: {},
  dto,
  serialize,
})
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@SetCurrentUser
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
    'productHierarchy.isActive': true,
    'productHierarchy.isEnabled': true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@ApiTags('Products')
@Controller('products')
@SetController([CloneCrudController, DeleteCrudController])
export class OemProductsController implements CrudController<OemProductEntity> {
  constructor(public service: OemProductsService) {}
}
