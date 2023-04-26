import { CBFunction, HookCB } from '../test.utils/init-test.util';

export type RunTest = (
  comparedData?: object | Promise<object>,
  data?: object | Promise<object>,
  path?: string | Promise<string>,
  cb?: CBFunction,
  hookCB?: HookCB,
) => void;