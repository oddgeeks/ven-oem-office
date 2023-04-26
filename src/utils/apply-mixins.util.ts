import { copyMetadata } from './copy-metadata.util';
//this is a custom applyMixins which allow you to properly COPY metadata, allowing using params decorator
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    //clone the propertyDescriptor to not temper with the original.
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const newPropertyDescriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name,
      );
      if (typeof newPropertyDescriptor.value === 'function') {
        const originalPropertyDescription = newPropertyDescriptor.value;
        // wrap the original function so that Reflect.defineMetadata gets applied to the
        // newly created function instead of to the prototype function of FilterController
        newPropertyDescriptor.value = (...args: any[]) =>
          originalPropertyDescription(...args);

        copyMetadata(
          originalPropertyDescription.value,
          newPropertyDescriptor.value,
        );
      }

      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name),
      );
    });
  });
}
