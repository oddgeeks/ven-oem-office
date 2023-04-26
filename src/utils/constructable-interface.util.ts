export interface IConstructable<T> {
  new (...args: any): T;
}

export type Constructor<T> = new (...args: any[]) => T;

export const makeConstructable = <T extends Constructor<IConstructable<T>>>(
  Type: T,
) => {
  return class extends Type {
    constructor(...args: any[]) {
      super(...args);
    }
  };
};

export type Instantiable<T = any> = { new (...args: any[]): T };

export function generateConstructableClass<T>(myClass: Instantiable<T>): T {
  return new myClass();
}
