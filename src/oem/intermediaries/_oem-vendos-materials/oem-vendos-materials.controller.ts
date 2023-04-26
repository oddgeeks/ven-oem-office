import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Override } from '@nestjsx/crud';
import { OemVendosMaterialsService } from './oem-vendos-materials.service';
import { OemVendosMaterials } from './oem-vendos-materials.entity';
import { dto } from './oem-vendos-materias.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { OemVendosUsers } from '../_oem-vendos-users/oem-vendos-users.entity';

@Crud({
  model: {
    type: OemVendosMaterials,
  },
  params: {
    id: {
      field: 'vendoId',
      type: 'number',
    },
    materialId: {
      field: 'materialId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      vendo: {
        eager: false,
      },
      material: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
    updateOneBase: {
      allowParamsOverride: true,
    },
  },
  dto,
})
@ApiTags('Vendos')
@Controller('/vendos/:id/materials/')
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
export class OemVendosMaterialsController
  implements CrudController<OemVendosMaterials>
{
  constructor(public service: OemVendosMaterialsService) {}

  get base(): CrudController<OemVendosMaterials> {
    return this;
  }
}
