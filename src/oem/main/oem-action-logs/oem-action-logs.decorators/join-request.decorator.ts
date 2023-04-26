import { InjectRepository } from '@nestjs/typeorm';
import { OemActionLogEntity } from '../oem-action-log.entity';
import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';

export function JoinRequest(
  joinNestedFields: Array<{ value: string; nestedResponse: boolean }> = [],
  bubble = true,
) {
  const injectActionLogRepo = InjectRepository(OemActionLogEntity);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectActionLogRepo(target, 'repoActionLog');
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      try {
        const req = args[0];
        const joins = req.parsed.join.map((join) =>
          join.field &&
          join.field.charAt(0) === join.field.charAt(0).toUpperCase()
            ? join.field
            : join.field.charAt(0).toUpperCase() + join.field.slice(1),
        );
        const repos = joins.map((join) =>
          this['repoActionLog'].manager.getRepository(join),
        );
        let actionLogResults = (await originalMethod.apply(this, args))['data'];
        actionLogResults = Array.isArray(actionLogResults)
          ? actionLogResults
          : [].push(actionLogResults);
        for (const actionLogResult of actionLogResults) {
          for (const repo of repos) {
            const primaryKeys = repo['metadata'].primaryColumns.map(
              (primaryKey) => primaryKey.propertyName,
            );
            let searchValue = {};
            for (const [
              index,
              { value, nestedResponse },
            ] of joinNestedFields.entries()) {
              for (const primaryKey of primaryKeys) {
                if (
                  actionLogResult &&
                  actionLogResult[value] &&
                  !actionLogResult[value][primaryKey]
                ) {
                  delete searchValue[primaryKey];
                } else
                  searchValue = {
                    ...searchValue,
                    [primaryKey]:
                      actionLogResult &&
                      actionLogResult[value] &&
                      actionLogResult[value][primaryKey],
                  };
              }
              //TODO: need to add a serialization dto for avoiding returning a sensitive information

              const relationRes =
                !_.isEmpty(searchValue) && (await repo.findOne(searchValue));
              if (!relationRes) {
                new NotFoundException(
                  `The join relation ${repo.metadata.targetName} with ${searchValue} not found`,
                );
              }
              const relationName =
                repo.metadata.targetName.charAt(0).toLowerCase() +
                repo.metadata.targetName.slice(1);
              if (nestedResponse && relationRes) {
                actionLogResult[value][relationName] = relationRes;
              } else {
                relationRes && (actionLogResult[relationName] = relationRes);
              }
            }
          }
        }
        return actionLogResults;
      } catch (error) {
        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
