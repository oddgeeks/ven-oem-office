import { cloneDeep } from 'lodash';
import { BaseEntity, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

//https://github.com/nestjsx/crud/issues/177
/**
 * At the moment we have an issue while trying PUT or PATCH foreign keys with ?join=relation.
 * So if we have relationID_1 = 1 and relationID_2 = 2 and will try to replace them to some different one the change wouldn't happen,
 * bc the current flow of TypeOrmCrudFramework:
 * 1) search an exemplar with current params
 * 2) it returns the current exemplar with included join relations
 * 3) save the full entity with overriding params and if we put included child relations
 * - then it would override the previous ones, bc child relations were got from point 1)
 * that's why we get this strange behavior decorator
 */
export function FixUpdateReplaceOne<T extends { new(...args: any[]): any }>(
  target: T,
) {
  const decoratedClass = class extends target {
    constructor(...args: any[]) {
      super(...args);
    }

    _getPrimaryKeys(repo?: Repository<T & BaseEntity>) {
      const _repo: Repository<T & BaseEntity> = repo || this.repo;
      return _repo.metadata.primaryColumns.map(
        (item: ColumnMetadata) => item.propertyName,
      );
    }

    async _callFunctionWithOverrideParams(
      args: any[],
      func: string,
    ): Promise<Array<any>> {
      const id = args[0].parsed.paramsFilter.find(
        (params) => params.field === args[0].options.params.id?.field,
      );
      const newArgs = cloneDeep(args);

      newArgs[0].parsed.join = [];
      // TODO: I think we should not allow to update foreign key via PATCH, should be PUT
      if (func == 'updateOne' || func == 'replaceOne') {
        // Security issue! it would allow to edit product which was deleted, or hierarchy was deleted/inactivated
        newArgs[0].parsed.search = {
          $and: [
            ...args[0].parsed.paramsFilter.map((filter) => {
              return { [filter.field]: { [filter.operator]: filter.value } };
            }),
          ],
        };
      }

      Object.keys(newArgs[0]?.options?.query?.join || {}).forEach((key) => {
        if (newArgs[0]?.options?.query?.join[key].eager === true) {
          newArgs[0].options.query.join[key].eager = false;
        }
      });
      newArgs[1] = { ...newArgs[1], [id?.field]: id?.value };

      // console.dir({ newArgs }, { depth: null });
      await super[func].call(this, ...newArgs);

      return super.getOne({
        ...args[0],
      });
    }

    async updateOne(...args: any[]) {
      return await this._callFunctionWithOverrideParams.apply(this, [
        args,
        'updateOne',
      ]);
    }

    async replaceOne(...args: any[]) {
      return await this._callFunctionWithOverrideParams.apply(this, [
        args,
        'replaceOne',
      ]);
    }
  };
  Object.defineProperty(decoratedClass, 'name', {
    value: target.name,
  });
  return decoratedClass;
}
