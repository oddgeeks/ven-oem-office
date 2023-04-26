import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
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
import { OemUserEntity, User } from './oem-user.entity';
import { OemUsersService } from './oem-users.service';
import { dto, serialize } from './oem-user.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { SetCurrentUser } from './oem-users.decorators/set-current-user.decorator';
import { OemUserDeleteDto } from './oem-user.dto/oem-user.delete.dto';
import { REQUEST } from '@nestjs/core';
import { OemUserRoleReassignDto } from './oem-user.dto/oem-user.role-reassign.dto';

interface ICrudControllerCustomDelete<T>
  extends Omit<CrudController<T>, 'deleteOneBase'> {
  deleteOneBase?(req: CrudRequest, dto?: OemUserDeleteDto): Promise<void | T>;
}

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemUserEntity,
  },
  params: {
    id: {
      field: 'userId',
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
      vendos: {
        eager: false,
      },
      quotes: {
        eager: false,
      },
      role: {
        eager: false,
      },
      products: {
        eager: false,
      },
      geoHierarchy: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
//TODO: do not allow to update user by everyone!
//TODO add a decorator composition
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@SetCurrentUser
@CrudAuth({
  filter: (req) => ({
    /*region: {
      $ne: 'system',
    },*/
    isEnabled: true,
    // There is no need to prevent access for returning users when the geoHierarchy is not active.
    // This is because users are accessed by admins typically or a user might access their own profile.
    //
    // 'geoHierarchy.isActive': true,
    //
    companyId: req.user.companyId,
    'geoHierarchy.isEnabled': true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@ApiTags('Users')
@Controller('users')
@Feature('Users')
export class OemUsersController implements ICrudControllerCustomDelete<User> {
  constructor(
    public service: OemUsersService,
    @Inject(REQUEST) private request,
  ) {}

  get base(): ICrudControllerCustomDelete<User> {
    return this;
  }

  @ApiQuery({
    name: 'replaceUserId',
    schema: {
      type: 'number',
    },
  })
  // it doesn't work with class decorator SetCurrentUser because @ParsedRequest and @Query are not handled, if you know how to figure out it - you are welcome
  @Override('deleteOneBase')
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
    @Query() dto?: OemUserDeleteDto,
  ) {
    dto = dto || this.request.query;
    req['params'] = this.request.params;
    console.debug('deleteOne User');
    return await this.service.deleteOne.call(this, req, dto);
  }

  @Patch(`/:id/reassign/:targetUserId`)
  @ApiOperation({
    description: 'Reassign all the quotes and vendos to the target user',
  })
  @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
    allowEmptyValue: false,
  })
  @ApiParam({
    name: 'targetUserId',
    schema: {
      type: 'number',
    },
    allowEmptyValue: false,
  })
  reassign(@Param() params: any) {
    return this.service.reassign(params);
  }

  @ApiOkResponse({
    description: 'The user roles re-assign.',
  })
  @ApiOperation({
    summary: 'Re-assign all users with given role id to another role.',
  })
  @Patch(`/roles/reassign`)
  @ApiBody({ type: OemUserRoleReassignDto })
  async reassignUserRoles(
    @ParsedRequest() req: CrudRequest & { user: OemUserEntity },
    @Body() body: OemUserRoleReassignDto,
  ) {
    return await this.service.bulkReassignRoles(req, body);
  }
}
