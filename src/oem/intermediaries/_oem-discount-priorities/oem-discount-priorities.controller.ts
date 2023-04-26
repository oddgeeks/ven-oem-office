import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto } from './oem-discount-priorities.dto';
import { OemDiscountPrioritiesService } from './oem-discount-priorities.service';
import { OemDiscountPriorities } from './oem-discount-priorities.entity';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemDiscountPriorities,
  },
  params: {
    sourceId: {
      field: 'sourceDiscountId',
      type: 'number',
    },
    targetId: {
      field: 'targetDiscountId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      sourceDiscount: {
        eager: true,
      },
      targetDiscount: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['replaceOneBase', 'getManyBase', 'getOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
  },
  dto,
})
@ApiTags('Discount Manager')
@Controller('/discount-priorities/:sourceId/discounts')
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
    /*'sourceDiscount.isEnabled': true,
    'targetDiscount.isEnabled': true,*/
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@ApiBearerAuth('JWT-auth')
@SetCurrentUser
export class OemDiscountPrioritiesController
  implements CrudController<OemDiscountPriorities>
{
  constructor(public service: OemDiscountPrioritiesService) {}

  get base(): CrudController<OemDiscountPriorities> {
    return this;
  }

  @ApiOkResponse({
    description: 'Deleted discount priority.',
  })
  @ApiOperation({
    summary: 'Delete a single DiscountPriorities',
  })
  @Delete('/:targetId')
  @ApiParam({
    name: 'targetId',
    schema: {
      type: 'number',
    },
  })
  @ApiParam({
    name: 'sourceId',
    schema: {
      type: 'number',
    },
  })
  async deleteOne(@Param() params) {
    return this.service.disableOne(params);
  }
}
