import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto } from './oem-roles-visible-product-fields.dto';
import { OemRolesVisibleProductFields } from './oem-roles-visible-product-fields.entity';
import { OemRolesVisibleProductFieldsService } from './oem-roles-visible-product-fields.service';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemRolesVisibleProductFields,
  },
  params: {
    id: {
      field: 'roleVisibleProductFieldId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      role: {
        eager: false,
      },
      visibleProductField: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['updateOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
    deleteOneBase: {
      returnDeleted: true,
    },
  },
  dto,
})
@ApiTags('Discount Manager')
@Controller('/roles-visible-product-fields/')
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
export class OemRolesVisibleProductFieldsController
  implements CrudController<OemRolesVisibleProductFields>
{
  constructor(public service: OemRolesVisibleProductFieldsService) {}
}
