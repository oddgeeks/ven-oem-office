import { applyMixins } from '../../utils/apply-mixins.util';
import { Inject } from '@nestjs/common';
import { copyMetadata } from '../../utils/copy-metadata.util';
import { REQUEST } from '@nestjs/core';

export function SetController(controllers: Array<any> = []) {
  return function <T extends { new (...args: any[]): any }>(
    target: T,
  ) {
    const injectRequest = Inject(REQUEST);
    const decoratedClass = class extends target {
      constructor(...args: any[]) {
        super(...args);
        let extendedDescription: PropertyDescriptor = {};
        for (const controller of controllers) {
          extendedDescription = {
            ...extendedDescription,
            ...Object.getOwnPropertyDescriptors(controller.prototype),
          };
        }
        //console.table(descriptors);

        for (const [propertyName, descriptor] of Object.entries(
          extendedDescription,
        )) {
          const isMethod =
            typeof descriptor.value == 'function' &&
            propertyName != 'constructor';

          if (!isMethod) continue;
          const originalMethod = descriptor.value;
          descriptor.value = async function (...args: any[]) {
            args[0] = {
              ...args[0],
              ...this.request['NESTJSX_PARSED_CRUD_REQUEST_KEY'],
            };
            //dto
            if (!args[1]) {
              args[1] = {};
            }
            args[1] = {
              ...args[1],
              ...this.request.body,
            };
            return originalMethod.apply(this, args);
          };

          if (originalMethod != descriptor.value) {
            copyMetadata(originalMethod, descriptor.value);
          }
          Object.defineProperty(
            decoratedClass.prototype,
            propertyName,
            descriptor,
          );
        }
      }
    };

    injectRequest(target.prototype, 'request');
    applyMixins(decoratedClass, [...controllers, target]);

    Object.defineProperty(decoratedClass, 'name', {
      value: target.name,
    });
    return decoratedClass;
  };
}
