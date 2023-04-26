import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Delete, Param } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemHierarchyEntity } from './oem-hierarchy.entity';
import { OemHierarchiesService } from './oem-hierarchies.service';
import { dto, serialize } from './oem-hierarchy.dto';
import { OemHierarchyDeleteDto } from './oem-hierarchy.dto/oem-hierarchy.delete.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemHierarchyEntity,
  },
  params: {
    id: {
      field: 'hierarchyId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      hierarchyLevel: {
        eager: true,
      },
      products: {
        eager: false,
      },
      users: {
        eager: false,
      },
      parent: {
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
@ApiTags('Company')
@Controller('hierarchies')
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
export class OemHierarchyController
  implements CrudController<OemHierarchyEntity>
{
  constructor(public service: OemHierarchiesService) {}

  get base(): CrudController<OemHierarchyEntity> {
    return this;
  }

  /*   @ApiParam({
    name: 'id',
    schema: {
      type: 'number',
    },
  })
  @Get(`test/:id`)
  async test() {
    const entity = await this.service.repo.findOne({
      where: { hierarchyId: 73 },
    });
    const res = await this.service.repo.findAncestorsTree(entity); //Gets all parents (ancestors) of the given entity. Returns them in a tree - nested into each other.
    return res;
  } */

  @Delete(`/:hierarchyId/reassign/:replacementHierarchyId`)
  async deleteWithReplacement(@Param() params: OemHierarchyDeleteDto) {
    return this.service.deleteWithReplacement(params);
  }
}
