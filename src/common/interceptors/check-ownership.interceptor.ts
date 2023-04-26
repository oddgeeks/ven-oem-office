import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Inject,
  mixin,
  UnauthorizedException,
  NotImplementedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export function mixinCheckOwnerchip<T extends new (...args: any[]) => any>(
  entityClass: T,
  relationName = 'user',
): any {
  class CheckOwnerchipInterceptor
    extends TypeOrmCrudService<T>
    implements NestInterceptor
  {
    constructor(
      @Inject(getRepositoryToken(entityClass))
      protected readonly repo: Repository<T>,
    ) {
      super(repo);
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();
      const item: any = await this.findOne(req.params.id, {
        relations: [relationName],
      });
      if (!req.user) {
        throw new NotImplementedException(
          'You Must Implement the Auth guard first',
        );
      }
      if (item && item[relationName] && item[relationName].id !== req.user.id) {
        throw new UnauthorizedException(
          'You are not the owner of this resource',
        );
      }
      return next.handle();
    }
  }
  return mixin(CheckOwnerchipInterceptor);
}
