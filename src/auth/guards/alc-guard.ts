import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { getAction, getFeature } from '@nestjsx/crud';
import { DataAccessEnum } from '../../oem/main/oem-roles/oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../../oem/main/oem-roles/oem-role.enums/create-access.enum';
import { OemHierarchiesService } from '../../oem/main/oem-hierarchies/oem-hierarchies.service';

/**
 * enum CrudActions {
  ReadAll = "Read-All",
  ReadOne = "Read-One",
  CreateOne = "Create-One",
  CreateMany = "Create-Many",
  UpdateOne = "Update-One",
  ReplaceOne = "Replace-One",
  DeleteOne = "Delete-One",
}
 */

@Injectable()
export class ALCGuard implements CanActivate {
  constructor(
    //   private readonly reflector: Reflector,
    @Inject(OemHierarchiesService)
    private hierarchiesService: OemHierarchiesService,

    public restfulCrudOptions: {
      readAllDataAccess: string[];
      readOneDataAccess: string[];
      createOneCreateAccess: string[];
      updateOneCreateAccess: string[];
      deleteOneCreateAccess: string[];
    },
  ) {
    this.restfulCrudOptions = {
      readAllDataAccess: [DataAccessEnum.ALL],
      readOneDataAccess: [DataAccessEnum.ALL],
      createOneCreateAccess: [
        CreateAccessEnum.ALL,
        CreateAccessEnum.INTERNAL_CREATE,
      ],
      updateOneCreateAccess: [
        CreateAccessEnum.ALL,
        CreateAccessEnum.EDIT_APPROVE_ONLY,
      ],
      deleteOneCreateAccess: [CreateAccessEnum.ALL],
    };
  }

  private checkPermission(accesses: Array<string>, currentAccess: string) {
    return accesses.indexOf(currentAccess) !== -1;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);
    const role = request.user.role;

    switch (action) {
      case 'Read-All': {
        return this.checkPermission(
          this.restfulCrudOptions.readAllDataAccess,
          role.dataAccess,
        );
      }

      case 'Read-One': {
        return this.checkPermission(
          this.restfulCrudOptions.readOneDataAccess,
          role.dataAccess,
        );
      }

      case 'Create-One': {
        return this.checkPermission(
          this.restfulCrudOptions.createOneCreateAccess,
          role.createAccess,
        );
      }

      case 'Update-One': {
        return this.checkPermission(
          this.restfulCrudOptions.updateOneCreateAccess,
          role.createAccess,
        );
      }

      case 'Delete-One': {
        return this.checkPermission(
          this.restfulCrudOptions.deleteOneCreateAccess,
          role.createAccess,
        );
      }

      default: {
        return false;
      }
    }
  }
}
