import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { AuthGuard } from '@nestjs/passport';
import { OemUnitTierEntity } from './oem-unit-tier.entity';
import { OemUnitTiersService } from './oem-unit-tiers.service';
import { dto, serialize } from './oem-unit-tier.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { SetController } from '../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemUnitTierEntity,
  },
  params: {
    id: {
      field: 'unitTierId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      pricingModel: {
        eager: false,
      },
    },
  },
  dto,
  serialize,
})
@ApiTags('Products')
@Controller('unit-tiers')
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
export class OemUnitTiersController
  implements CrudController<OemUnitTierEntity>
{
  constructor(public service: OemUnitTiersService) {}
}
