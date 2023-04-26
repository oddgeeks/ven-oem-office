import { TestCRUDEnum } from '../test.enums/test-crud.enum';
import { ITest } from '../test.interfaces/test.interface';

export type TestCRUD = Record<string | TestCRUDEnum, Partial<ITest>>;
