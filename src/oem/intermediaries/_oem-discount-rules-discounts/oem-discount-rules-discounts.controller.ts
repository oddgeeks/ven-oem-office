import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto } from './oem-discount-rules-discounts.dto';
import { OemDiscountRulesDiscounts } from './oem-discount-rules-discounts.entity';
import { OemDiscountRulesDiscountsService } from './oem-discount-rules-discounts.service';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemDiscountRulesDiscounts,
  },
  params: {
    id: {
      field: 'discountRuleId',
      type: 'number',
    },
    discountId: {
      field: 'discountId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      discount: {
        eager: true,
      },
      discountRule: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['replaceOneBase', 'deleteOneBase', 'getManyBase', 'getOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
  },
  dto,
})
@ApiTags('Discount Manager')
@Controller('/discount-rules/:id/discounts/')
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
    'discountRule.isEnabled': true,
    'discountRule.isActive': true,
    'discount.isEnabled': true,
    'discount.isActive': true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@ApiBearerAuth('JWT-auth')
@SetCurrentUser
export class OemDiscountRulesDiscountsController
  implements CrudController<OemDiscountRulesDiscounts>
{
  constructor(public service: OemDiscountRulesDiscountsService) {}
}
