import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';
import { OemBundleEntity } from './oem-bundle.entity';
import { OemBundlesService } from './oem-bundles.service';
import { dto, serialize } from './oem-bundle.dto';

@Crud({
  model: {
    type: OemBundleEntity,
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
      quotesBundles: {
        eager: false,
      },
      ownerUser: {
        eager: false,
      },
      customersBundles: {
        eager: false,
      },
      products: {
        eager: true,
      },
      'products.pricingModel': {
        eager: false,
      },
      'products.priceTiers': {
        eager: false,
        alias: 'pt',
      },
      'products.priceTiers.unitTier': {
        eager: false,
        alias: 'ut',
      },
      productHierarchy: {
        eager: true,
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
@Controller('bundles')
@SetController([CloneCrudController, DeleteCrudController])
export class OemBundlesController implements CrudController<OemBundleEntity> {
  constructor(public service: OemBundlesService) {}
}
