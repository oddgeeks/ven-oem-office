import { get, cloneDeep } from 'lodash';

export const FilterCurrentUser = (filterKey = 'userId') => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const userId = get(args[0], 'user.userId');

      const newArgs = cloneDeep(args);
      if (userId) {
        newArgs[0].parsed.search = {
          $and: [
            ...newArgs[0].parsed.search['$and'],
            {
              [filterKey]: {
                ['$eq']: userId,
              },
            },
          ],
        };
      }

      return originalMethod.apply(this, newArgs);
    };
  };
};
