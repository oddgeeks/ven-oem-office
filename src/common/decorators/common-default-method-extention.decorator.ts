import { FixUpdateReplaceOne } from './fix-replace-one.decorator';
import { SetDeleteMethod } from './set-delete-method.decorator';
import { SetCurrentTenant } from './set-current-tenant.decorator';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';

/**
 * applyDecorators doesn't work well with class decorators
 */
export function CommonDefaultMethodExtension<T>(target: Constructor<T>) {
  return SetCurrentTenant(FixUpdateReplaceOne(SetDeleteMethod(target)));
}
