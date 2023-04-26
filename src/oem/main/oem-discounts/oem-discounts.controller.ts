import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OemDiscountEntity } from './oem-discount.entity';
import { OemDiscountsService } from './oem-discounts.service';

import { dto, serialize } from './oem-discount.dto';
import { OemDiscountPriorityDto } from './oem-discount.dto/oem-discount.priority.dto';

import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';

import { CloneCrudController } from '../../../common/controllers/clone-crud.controller';
import { DeleteCrudController } from '../../../common/controllers/delete-crud.controller';

import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { SetController } from '../../../common/decorators/set-controller.decorator';

@Crud({
  model: {
    type: OemDiscountEntity,
  },
  params: {
    id: {
      field: 'discountId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      // Why is this commented out?
      /*
        sourceDiscounts: {
          eager: true,
        },
        targetDiscounts: {
          eager: true,
        },
        'targetDiscounts.discount': {
          eager: false,
        },
        'sourceDiscounts.discount': {
          eager: false,
        }
      */
      discountRulesDiscounts: {
        eager: false,
      },
      'discountRulesDiscounts.discountRule': {
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
@ApiTags('Discount Manager')
@Controller('discounts')
@CrudAuth({
  filter: (req) => ({
    isEnabled: true,
    companyId: req.user.companyId,

    // What is the purpose in this? - I suppose that we don't show discounts if related rule is empty
    /*
      'discountRulesDiscounts.discountRule.isActive': true,
      'discountRulesDiscounts.discountRule.isEnabled': true,
    */
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@SetController([CloneCrudController, DeleteCrudController])
export class OemDiscountsController
  implements CrudController<OemDiscountEntity>
{
  constructor(public service: OemDiscountsService) {}

  get base(): CrudController<OemDiscountEntity> {
    return this;
  }

  @Post(`priority/`)
  @ApiBody({
    type: OemDiscountPriorityDto,
  })
  @UseInterceptors(CrudRequestInterceptor)
  setRetroactivelyPriority(
    @ParsedRequest() req: CrudRequest,
    @Body() body: OemDiscountPriorityDto,
  ) {
    return this.service.setRetroactivelyPriority(req, body);
  }
}
