import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotImplementedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Hierarchy,
  OemHierarchyEntity,
} from '../../oem/main/oem-hierarchies/oem-hierarchy.entity';
import { TreeRepository } from 'typeorm';
import { SetCurrentTenant } from '../decorators/set-current-tenant.decorator';

@Injectable()
@SetCurrentTenant
export class InjectSubHierarchyInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(OemHierarchyEntity)
    private hierarchyRepo: TreeRepository<Hierarchy>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new NotImplementedException(
        'You Must Implement the Auth guard first',
      );
    }
    if (req.user) {
      const entity = await this.hierarchyRepo.findOne(req.user.geoHierarchyId, {
        relations: ['hierarchyLevel'],
      });
      req.user.subHierarchies = await this.hierarchyRepo.findDescendants(
        entity,
      );
    }
    return next.handle();
  }
}
