export const isPromise = (p) => {
  return typeof p === 'object' && typeof p.then === 'function';
};
export const isAsync = (f) => {
  if (
    f.constructor.name === 'AsyncFunction' ||
    (typeof f === 'function' && isPromise(f))
  ) {
    return true;
  }
  return false;
};
