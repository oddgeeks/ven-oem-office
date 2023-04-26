import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { AuthGuard } from '@nestjs/passport';
import { OemPriceTierEntity } from './oem-price-tier.entity';
import { OemPriceTiersService } from './oem-price-tiers.service';
import { dto, serialize } from './oem-price-tier.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemPriceTierEntity,
  },
  params: {
    id: {
      field: 'priceTierId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      unitTier: {
        eager: false,
      },
      product: {
        eager: false,
      },
    },
  },
  dto,
  serialize,
})
@ApiTags('Products')
@Controller('price-tiers')
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
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
@SetController([DeleteCrudController])
export class OemPriceTiersController
  implements CrudController<OemPriceTierEntity>
{
  constructor(public service: OemPriceTiersService) {}
}
