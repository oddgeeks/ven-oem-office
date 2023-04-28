import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { copyMetadata } from '../../../../utils/copy-metadata.util';
/**
 * Decorator for injecting current user to ParsedRequest() for CRUD_TYPEORM FRAMEWORK;
 * MAKE sure that the first param should be req: ParsedRequest
 */

/*export function SetCurrentUser(target: Function) {
  //console.log(target, Object.keys(this.prototype))
  for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
    const propertyValue = target.prototype[propertyName];
    const isMethod = propertyValue instanceof Function;
    console.log(propertyName);
    if (!isMethod)
      continue;

    const descriptor = getMethodDescriptor(propertyName);
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log('The method args are: ' + JSON.stringify(args));
      const result = originalMethod.apply(this, args);
      console.log('The return value is: ' + result);
      return result;
    };

    Object.defineProperty(target.prototype, propertyName, descriptor);
  }

  function getMethodDescriptor(propertyName: string): TypedPropertyDescriptor<any> {
    if (target.prototype.hasOwnProperty(propertyName))
      return Object.getOwnPropertyDescriptor(target.prototype, propertyName);

    // create a new property descriptor for the base class' method
    return {
      configurable: true,
      enumerable: true,
      writable: true,
      value: target.prototype[propertyName],
    };
  }
};*/
export function SetCurrentUser<T extends { new (...args: any[]): any }>(
  target: T,
) {
  const injectRequest = Inject(REQUEST);
  const decoratedClass = class extends target {
    constructor(...args: any[]) {
      super(...args);
      const descriptors = {
        ...Object.getOwnPropertyDescriptors(decoratedClass.prototype),
        ...Object.getOwnPropertyDescriptors(target.prototype),
        //
      };
      /*const descriptors = Object.getOwnPropertyDescriptors(
        // for overriding all extends methods use Object.getPrototypeOf(target.prototype),
        // but in that case you might get an issue when initialization db requests cannot get the current tenant
        // (bc we get it via headers, but service requests cannot get this info)
        Object.getPrototypeOf(target.prototype),
      );
      */
      // console.table(descriptors);
      for (const [propertyName, descriptor] of Object.entries(descriptors)) {
        const isMethod =
          typeof descriptor.value == 'function' &&
          propertyName != 'constructor';

        // console.log('GET METHODS', propertyValue, propertyName, isMethod, target[propertyName], decoratedClass[propertyName], target.prototype[propertyName], decoratedClass.prototype[propertyName]);
        if (!isMethod) continue;
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
          if (!args[0]) {
            args[0] = {};
          }
          args[0]['user'] = this.request.user;
          // args[0]['request'] = this.request;
          const result = originalMethod.apply(this, args);
          return result;
        };

        if (originalMethod != descriptor.value) {
          copyMetadata(originalMethod, descriptor.value);
        }
        // manually override @Override decorator (support basic method following TypeOrm CRUD nestjs docs)
        // TODO: Need to investigate: when we use a class decorator in some reason it do not go through controller,
        // if we define to propertyBase then it goes, but params decorators don't work
        if (
          target.name == 'OemUsersController' &&
          decoratedClass.prototype[propertyName] &&
          [
            'deleteOne',
            // 'createOne', 'updateOne', 'createOne', 'replaceOne', 'getOne', 'getMany',
          ].includes(propertyName)
        ) {
          Reflect.defineMetadata(
            'NESTJSX_OVERRIDE_METHOD_METADATA',
            `${propertyName}Base`,
            descriptor.value,
          );
          Object.defineProperty(
            decoratedClass.prototype,
            `${propertyName}Base`,
            descriptor,
          );
        } else
          Object.defineProperty(
            decoratedClass.prototype,
            propertyName,
            descriptor,
          );
      }

      function getMethodDescriptor(
        propertyName: string,
      ): TypedPropertyDescriptor<any> {
        if (target.prototype.hasOwnProperty(propertyName))
          return Object.getOwnPropertyDescriptor(
            target.prototype,
            propertyName,
          );

        // create a new property descriptor for the base class' method
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: target.prototype[propertyName],
        };
      }
    }
  };
  //applyMixins(decoratedClass, [target]);

  Object.defineProperty(target, 'name', {
    value: target.name,
  });

  injectRequest(target.prototype, 'request');

  return decoratedClass;
}
