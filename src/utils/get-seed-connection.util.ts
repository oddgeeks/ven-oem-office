import { getConnection, Connection } from 'typeorm';
import {
  configureConnection,
  getConnectionOptions,
  createConnection,
} from 'typeorm-seeding';

export async function getSeedConnectionUtil(
  connectionName = 'MASTER_CONNECTION_CONF',
): Promise<Connection> {
  const connection = await new Promise((resolve) => {
    try {
      const conn = getConnection(connectionName);
      resolve(conn);
    } catch (err) {
      resolve(null);
    }
  });

  if (connection) {
    return connection as Connection;
  }

  // console.log(`creating new ${connectionName}`);

  configureConnection({
    root: process.cwd(),
    configName: 'orm-master.config.ts',
    connection: connectionName,
    // typeorm-seeding bug found while checking its source code,
    // it uses configureOption.name instead of configureOption.connection in createConnection function
    name: connectionName,
  } as any);

  const options = await getConnectionOptions();

  const newConnection = await createConnection(options);
  console.log('newConnection', newConnection.name);

  return newConnection;
}
