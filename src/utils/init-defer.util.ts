import * as Q from 'q';
import * as util from 'util';
import { isResolved } from './promise-is.util';

export type FunctionVariadic = (...args: any[]) => any;
export type Defer = {
  get: FunctionVariadic;
  resolve: FunctionVariadic;
  reset: FunctionVariadic;
};
export const initDefer = function () {
  let initializationDeferred = Q.defer();
  return {
    get: function () {
      return initializationDeferred.promise;
    },
    resolve: function (param) {
      initializationDeferred.resolve(param);
    },
    reset: function () {
      const tempDefer = Q.defer();
      initializationDeferred.promise = tempDefer.promise;
      initializationDeferred = tempDefer;
    },
  };
};
