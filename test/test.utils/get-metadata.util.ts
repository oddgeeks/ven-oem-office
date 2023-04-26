import { METHODS } from '../test.enums/methods.enum';

export const getMetaData = (method: METHODS) => {
  const expectedStatus: number = method === 'post' ? 201 : 200;
  let action: string;
  switch (method) {
    case 'post':
      action = 'create';
      break;
    case 'get':
      action = 'retrieve';
      break;
    case 'patch':
      action = 'update';
      break;
    case 'put':
      action = 'replace';
      break;
    case 'delete':
      action = 'delete';
      break;
  }
  return { action, expectedStatus };
};
