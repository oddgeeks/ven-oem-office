import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemQuotesMaterialsService } from './oem-quotes-materials.service';
import { OemQuotesMaterials } from './oem-quotes-materials.entity';
import { dto } from './oem-quotes-materials.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemQuotesMaterials,
  },
  params: {
    id: {
      field: 'quoteId',
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
      quote: {
        eager: false,
      },
      material: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['replaceOneBase', 'deleteOneBase', 'getManyBase', 'getOneBase'],
    replaceOneBase: {
      allowParamsOverride: true,
    },
    //exclude: ['createManyBase', 'createOneBase'],
  },
  dto,
})
@ApiTags('Quotes')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller('/quotes/:id/materials/')
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
export class OemQuotesMaterialsController
  implements CrudController<OemQuotesMaterials>
{
  constructor(public service: OemQuotesMaterialsService) {}
}
