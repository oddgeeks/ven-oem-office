import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudAuth,
  Feature,
  Override,
  CrudRequest,
  ParsedRequest,
} from '@nestjsx/crud';
import {
  ExternalUser,
  OemExternalUserEntity,
} from './oem-external-user.entity';
import { OemExternalUsersService } from './oem-external-users.service';
import { dto, serialize } from './oem-external-user.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { OemExternalUserDeleteDto } from './oem-external-user.dto/oem-external-user.delete.dto';
import { REQUEST } from '@nestjs/core';
import { OemExternalUserDto } from './oem-external-user.dto/oem-external-user.dto';

interface ICrudControllerCustomDelete<T>
  extends Omit<CrudController<T>, 'deleteOneBase'> {
  deleteOneBase?(
    req: CrudRequest,
    dto?: OemExternalUserDeleteDto,
  ): Promise<void | T>;
}

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemExternalUserEntity,
  },
  params: {
    id: {
      field: 'externalUserId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      company: {
        eager: false,
      },
      usersQuotes: {
        eager: false,
      },
      vendosQuotes: {
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
//TODO add a decorator composition
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@SetCurrentUser
@CrudAuth({
  filter: (req) => ({
    isEnabled: true,
    companyId: req.user.companyId,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@ApiTags('Users')
@Controller('external-users')
@Feature('External-Users')
export class OemExternalUsersController
  implements ICrudControllerCustomDelete<ExternalUser>
{
  constructor(
    public service: OemExternalUsersService,
    @Inject(REQUEST) private request,
  ) {}

  get base(): ICrudControllerCustomDelete<ExternalUser> {
    return this;
  }
  @ApiQuery({
    name: 'replaceUserId',
    schema: {
      type: 'number',
    },
  })
  // *it doesn't work with class decorator SetCurrentUser because @ParsedRequest and @Query are not handled, if you know how to figure out it - you are welcome
  @Override('deleteOneBase')
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
    @Query() dto?: OemExternalUserDto,
  ) {
    dto = dto || this.request.query;
    req['params'] = this.request.params;
    return await this.service.deleteOne.call(this, req, dto);
  }
}
