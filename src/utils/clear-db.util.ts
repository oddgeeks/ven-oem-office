import { getConnection, getConnectionManager } from 'typeorm';
// import {
//   DB_MAIN_DATABASE as DB_NAME,
//   DB_MAIN_USERNAME as DB_USER,
// } from '../environments';

//TODO: we should not provide hardcoded connection name in utils (doesn't work like expected)
export async function clearDB(connectionName = 'MASTER_CONNECTION_CONF') {
  const c = await getConnectionManager().connections.map((i) => i.name);

  console.log(
    'clearDB => connections',
    getConnectionManager().connections.map((i) => i.name),
    'connectionName',
    connectionName,
    c,
  );

  const connection = getConnection(c[0]);
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);

    await repository.query(
      `TRUNCATE "oem"."${entity.tableName}" RESTART IDENTITY CASCADE;`,
    );
  }
}
