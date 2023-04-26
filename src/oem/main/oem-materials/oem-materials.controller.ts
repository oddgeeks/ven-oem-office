import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { OemMaterialEntity } from './oem-material.entity';
import { OemMaterialsService } from './oem-materials.service';
import { dto, serialize } from './oem-material.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemMaterialEntity,
  },
  params: {
    id: {
      field: 'materialId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {},
  dto,
  serialize,
})
@ApiTags('Company')
@Controller('materials')
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
export class OemMaterialsController
  implements CrudController<OemMaterialEntity>
{
  constructor(public service: OemMaterialsService) {}
}
