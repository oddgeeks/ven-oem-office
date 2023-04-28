import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto, serialize } from './oem-discount-rule.dto';
import { OemDiscountRuleEntity } from './oem-discount-rule.entity';
import { OemDiscountRulesService } from './oem-discount-rules.service';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../oem-users/oem-users.decorators/set-current-user.decorator';
import { CloneCrudController } from '../../../../common/controllers/clone-crud.controller';
import { SetController } from '../../../../common/decorators/set-controller.decorator';
import { DeleteCrudController } from '../../../../common/controllers/delete-crud.controller';

@Crud({
  model: {
    type: OemDiscountRuleEntity,
  },
  params: {
    id: {
      field: 'discountRuleId',
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
      discounts: {
        eager: false,
      },
      ownerUser: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
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
@ApiTags('Discount Manager')
@Controller('discount-rules')
@SetController([CloneCrudController, DeleteCrudController])
export class OemDiscountRulesController
  implements CrudController<OemDiscountRuleEntity>
{
  constructor(public service: OemDiscountRulesService) {}
}
