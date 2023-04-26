import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto, serialize } from './oem-visible-product-fields.dto';
import { OemVisibleProductFieldEntity } from './oem-visible-product-field.entity';
import { OemVisibleProductFieldsService } from './oem-visible-product-fields.service';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

//TODO: we need to have a general way how to filter join response
@Crud({
  model: {
    type: OemVisibleProductFieldEntity,
  },
  params: {
    id: {
      field: 'visibleProductFieldId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      discounts: {
        eager: false,
      },
      rolesDiscountListPrices: {
        eager: true,
        alias: 'rolesVisibleFields',
      },
    },
    /* filter: {
      'rolesVisibleFields.isEnabled': {
        $eq: true,
      },
    },*/
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
@ApiTags('Discount Manager')
@Controller('visible-product-fields')
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
export class OemVisibleProductFieldsController
  implements CrudController<OemVisibleProductFieldEntity>
{
  constructor(public service: OemVisibleProductFieldsService) {}
}
