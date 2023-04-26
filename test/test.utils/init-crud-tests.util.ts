import { Defer, initDefer } from '../../src/utils/init-defer.util';
import { initTestDescription } from './init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { TestCRUDEnum } from '../test.enums/test-crud.enum';
import { appendToRecord } from '../../src/utils/append-to-record.util';
import { RunTest } from '../test.types/run-test.type';
import { TestCRUD } from '../test.types/test-crud.type';

const DESCRIBE_KEYS = {
  ...Object.values(TestCRUDEnum).reduce(
    (a, v) => ({ ...a, [`DESCRIBE_${v}`]: v }),
    {},
  ),
};

enum DESCRIBE_ENUM {
  GET_ALL = 'DESCRIBE_GET_ALL',
  GET = 'DESCRIBE_GET',
  POST = 'DESCRIBE_POST',
  PATCH = 'DESCRIBE_PATCH',
  PUT = 'DESCRIBE_PUT',
  DELETE = 'DESCRIBE_DELETE',
}

const DescribeKeys = [...Object.keys(DESCRIBE_KEYS)] as const;
type DescribeKey = typeof DescribeKeys[number];

export type CrudTests = {
  defers: {
    deferServer: Defer;
    deferComparedData: Defer;
    deferPath: Defer;
    deferSentData: Defer;
  };
  tests: Partial<Record<DescribeKey, RunTest>>;
};
export type Options = {
  path: string;
  //return only declared tests here
  only?: Partial<TestCRUD>;
  //return/override declared tests here + default CRUD
  include?: Partial<TestCRUD>;
  //exclude declared tests from default CRUD
  exclude?: Array<TestCRUDEnum | string>;
};

//TODO: need to create a module for CRUD testing, and this module should be just initTesting
export default function initCrudTesting(options?: Options): CrudTests {
  const deferServer = initDefer();
  const deferComparedData = initDefer();
  const deferPath = initDefer();
  const deferSentData = initDefer();
  let tests: Record<DescribeKey, RunTest> = {};
  const only = options?.only && [...new Set([...Object.keys(options?.only)])];
  let include = [
    ...new Set([
      ...Object.keys(options?.include || {}),
      ...Object.values(TestCRUDEnum),
    ]),
  ];
  const exclude = options?.exclude || [];
  include = only || include; /*include.filter(function (item) {
    return Object.values(TestCRUDEnum).includes(TestCRUDEnum[item]);
  });*/
  include = include.filter(function (item) {
    return !exclude.includes(TestCRUDEnum[item]);
  });
  for (const i of include) {
    const DESCRIBE = initTestDescription({
      httpServer: deferServer.get(),
      method:
        (options?.only && options?.only[i]?.method) ||
        (options?.include && options?.include[i]?.method) ||
        METHODS[i] ||
        METHODS.GET,
      path:
        (options?.only && options?.only[i]?.path) ||
        (options?.include && options?.include[i]?.path) ||
        options?.path ||
        deferPath.get(),
      status:
        (options?.only && options?.only[i]?.status) ||
        (options?.include && options?.include[i]?.status),
      access_token:
        (options?.only && options?.only[i]?.access_token) ||
        (options?.include && options?.include[i]?.access_token),
    });
    Reflect.defineMetadata('name', i, DESCRIBE);
    tests = appendToRecord({
      ...tests,
      [`DESCRIBE_${i}`]: DESCRIBE,
    });
  }

  return {
    defers: {
      deferServer,
      deferComparedData,
      deferPath,
      deferSentData,
    },
    tests,
  };
}
