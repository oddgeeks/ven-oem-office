function delay(msec, value) {
  return new Promise((done) => window.setTimeout(() => done(value), msec));
}

export function isResolved(promise) {
  return Promise.race([
    delay(0, false),
    promise.then(
      () => true,
      () => false,
    ),
  ]);
}

export function isRejected(promise) {
  return Promise.race([
    delay(0, false),
    promise.then(
      () => false,
      () => true,
    ),
  ]);
}

export function isFinished(promise) {
  return Promise.race([
    delay(0, false),
    promise.then(
      () => true,
      () => true,
    ),
  ]);
}
