import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Query,
  Get,
} from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { OemStatsService } from './oem-stats.service';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { InjectSubHierarchyInterceptor } from '../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { AuthUser } from '../oem-users/oem-users.decorators/auth-user.decorator';

@Crud({
  model: {
    type: OemUserEntity,
  },
  params: {
    id: {
      primary: true,
      disabled: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'getManyBase',
      'getOneBase',
      'updateOneBase',
      'replaceOneBase',
      'recoverOneBase',
      'deleteOneBase',
    ],
  },
})
@ApiBearerAuth('JWT-auth')
@ApiTags('Stats')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseInterceptors(InjectSubHierarchyInterceptor)
@CrudAuth({
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@SetCurrentUser
@Controller('stats')
export class OemStatsController {
  constructor(public service: OemStatsService) {}

  @Get(`top-customers`)
  @ApiOperation({ description: 'Return top quoted customers' })
  @ApiQuery({
    name: 'offset',
    schema: {
      type: 'number',
      default: 0,
    },
  })
  @ApiQuery({
    name: 'limit',
    schema: {
      type: 'number',
      default: 10,
    },
  })
  @ApiQuery({
    name: 'sort',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        default: 'netAmount,DESC',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  getTopCustomers(@AuthUser() user: any, @Query() query: any) {
    return this.service.getTopCustomers(user, query);
  }

  @Get(`workflows/top-approvers`)
  @ApiOperation({ description: 'Return top approvers in your role' })
  @ApiQuery({
    name: 'offset',
    schema: {
      type: 'number',
      default: 0,
    },
  })
  @ApiQuery({
    name: 'limit',
    schema: {
      type: 'number',
      default: 10,
    },
  })
  @ApiQuery({
    name: 'sort',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        default: 'netAmount,DESC',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  getTopApprovers(@AuthUser() user: any, @Query() query: any) {
    return this.service.getTopApprovers(user, query);
  }

  @Get(`workflows/top-creators`)
  @ApiOperation({ description: 'Return your most active quote/vendo creators' })
  @ApiQuery({
    name: 'offset',
    schema: {
      type: 'number',
      default: 0,
    },
  })
  @ApiQuery({
    name: 'limit',
    schema: {
      type: 'number',
      default: 10,
    },
  })
  @ApiQuery({
    name: 'sort',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        default: 'netAmount,DESC',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  getTopCreators(@AuthUser() user: any, @Query() query: any) {
    return this.service.getTopCreators(user, query);
  }
}
