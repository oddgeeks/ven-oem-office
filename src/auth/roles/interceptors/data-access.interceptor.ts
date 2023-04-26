import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { DataAccessEnum } from '../../../oem/main/oem-roles/oem-role.enums/data-access.enum';
import { OemHierarchyEntity } from '../../../oem/main/oem-hierarchies/oem-hierarchy.entity';

@Injectable()
export class DataAccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.role?.dataAccess) {
      return next.handle();
    }

    const dataAccessFilter = {
      userId: undefined,
      geoHierarchyIds: undefined,
    };

    switch (user.role.dataAccess) {
      case DataAccessEnum.ALL:
        break;
      case DataAccessEnum.TEAM_SUB_HIERARCHY:
        const geoHierarchyIds = [user.geoHierarchyId];
        const subHierarchyIds = user.subHierarchies.map(
          (subHierarchy: OemHierarchyEntity) => subHierarchy.hierarchyId,
        );
        geoHierarchyIds.push(...subHierarchyIds);

        dataAccessFilter.geoHierarchyIds = geoHierarchyIds;
        break;
      case DataAccessEnum.TEAM_ONLY:
        dataAccessFilter.geoHierarchyIds = [user.geoHierarchyId];
        break;
      case DataAccessEnum.ASSIGNED_ONLY:
        dataAccessFilter.userId = user.userId;
        break;
      default:
        break;
    }

    req.user.dataAccessFilter = dataAccessFilter;

    // console.log('DataAccessInterceptor user', req.user);
    return next.handle();
  }
}
