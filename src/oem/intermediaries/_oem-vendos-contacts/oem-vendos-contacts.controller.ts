import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemVendosContactsService } from './oem-vendos-contacts.service';
import { OemVendosContacts } from './oem-vendos-contacts.entity';
import { dto } from './oem-vendos-contacts.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemVendosContacts,
  },
  params: {
    id: {
      field: 'vendoId',
      type: 'number',
    },
    contactId: {
      field: 'contactId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      vendo: {
        eager: false,
      },
      contact: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase'],
  },
  dto,
})
@ApiTags('Vendos')
@Controller('/vendos/:id/contacts/')
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
export class OemVendosContactsController
  implements CrudController<OemVendosContacts>
{
  constructor(public service: OemVendosContactsService) {}
}
