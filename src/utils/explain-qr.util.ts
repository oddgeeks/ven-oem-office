import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';
import { QueryRunner } from 'typeorm';
import { copyMetadata } from './copy-metadata.util';

export function explainQR(
  queryRunner: QueryRunner,
  explainParameters = {
    analyze: true,
    verbose: true,
    buffers: true,
  },
  format: 'text' | 'xml' | 'json' | 'yaml' = 'text',
) {
  const descriptor = Object.getOwnPropertyDescriptor(
    PostgresQueryRunner.prototype,
    'query',
  );
  const originalQuery = descriptor.value;
  console.log('descriptor', descriptor);

  descriptor.value = async (...args: any) => {
    const sql = args[0];
    const res = await originalQuery.call(queryRunner, ...args);
    //return res;

    let query = sql;
    if (
      args[0].indexOf('SET SESSION') == -1 &&
      args[0].indexOf('START') == -1 &&
      args[0].indexOf('ROLLBACK') == -1 &&
      args[0].indexOf('COMMIT') == -1
    ) {
      const boolParameters = Object.entries(explainParameters)
        .filter(
          (argument): argument is [string, boolean] =>
            typeof argument[1] === 'boolean',
        )
        .map(([key, value]) => `${key} ${value}`);

      const explainParametersString = [
        ...boolParameters,
        `FORMAT ${format.toUpperCase()}`,
      ]
        .join(', ')
        .toUpperCase();

      query = `EXPLAIN (${explainParametersString}) ${sql}`;
    }
    try {
      await originalQuery.apply(queryRunner, ['START TRANSACTION']);
      const resAnalyze = await originalQuery.apply(queryRunner, [
        query,
        ...args.slice(1),
      ]);

      await originalQuery.apply(queryRunner, ['ROLLBACK ']);

      if (resAnalyze && resAnalyze.records) {
        console.log(resAnalyze, resAnalyze.records);
      }
    } catch (e) {
      console.log(e, 'Cannot analyze this query');
    }
    return res;
  };

  if (originalQuery != descriptor.value) {
    copyMetadata(originalQuery, descriptor.value);
  }

  Object.defineProperty(queryRunner, 'query', descriptor);
}
