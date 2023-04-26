import * as request from 'supertest';
import { METHODS } from '../test.enums/methods.enum';
import { getMetaData } from './get-metadata.util';
import { ITest } from '../test.interfaces/test.interface';

type SendData = {
  access_token: string;
  body: object;
};
export type CBFunction = (response: {
  status: number;
  message: string;
  success: boolean;
  data: any;
  sentData?: SendData & object;
  comparedData?: object;
}) => void | Promise<void>;

export interface HookCB {
  beforeAllCB?: () => Promise<void>;
  afterAllCB?: () => Promise<void>;
  beforeEachCB?: () => Promise<void>;
  afterEachCB?: () => Promise<void>;
}

export function initTestDescription(params: ITest) {
  return function (
    comparedData?: object | Promise<object>,
    sendData?: SendData | object | Promise<SendData & object>,
    path?: string | Promise<string>,
    cb?: CBFunction,
    { beforeAllCB, afterAllCB, beforeEachCB, afterEachCB }: HookCB = {},
  ) {
    return describe(`${params.method.toUpperCase()} ${params.path}`, () => {
      beforeAll(async () => {
        beforeAllCB && (await beforeAllCB());
      });

      afterAll(async () => {
        afterAllCB && (await afterAllCB());
      });

      beforeEach(async () => {
        beforeEachCB && (await beforeEachCB());
      });

      afterEach(async () => {
        afterEachCB && (await afterEachCB());
      });

      it(
        params.message
          ? params.message
          : `should ${getMetaData(params.method).action} a ${JSON.stringify(
              comparedData,
            )}`,
        (done) => {
          path = path || params.path;
          Promise.all([params.httpServer, path, comparedData, sendData]).then(
            (promises) => {
              const server = promises[0];
              const path = promises[1];
              const comparedData = promises[2];
              const sendData = promises[3];
              const origin = params?.origin || 'demo.localhost';
              const res = request(server)
                [params.method](path)
                .set('Origin', origin);
              if ((sendData as SendData)?.access_token)
                res.auth((sendData as SendData)?.access_token, {
                  type: 'bearer',
                });
              if (
                [METHODS.POST, METHODS.PATCH, METHODS.PUT].indexOf(
                  params.method,
                ) !== -1
              ) {
                res.send((sendData as SendData).body || sendData);
              }
              res.end(async (_, res) => {
                console.debug(params.method + ' ' + path, sendData, origin);
                console.debug({
                  ...res.body,
                  data: JSON.stringify(res.body.data),
                });
                cb &&
                  (await cb({
                    ...res.body,
                    sentData: sendData,
                    comparedData: comparedData,
                  }));
                expect(res.status).toBe(
                  params.status || getMetaData(params.method).expectedStatus,
                );

                if (comparedData && Array.isArray(res.body.data)) {
                  expect(res.body.data).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining(
                        params.SerializeClass
                          ? new params.SerializeClass(comparedData)
                          : comparedData,
                      ),
                    ]),
                  );
                }
                if (comparedData && !Array.isArray(res.body.data)) {
                  expect(res.body.data).toEqual(
                    expect.objectContaining(
                      params.SerializeClass
                        ? new params.SerializeClass(comparedData)
                        : comparedData,
                    ),
                  );
                }
                done();
              });
            },
          );
        },
      );
    });
  };
}
