export function createInstance<T>(a: T): T {
  const t = a.constructor as {
    new (...args: ConstructorParameters<T | any>[]): T;
  };
  return new t();
}