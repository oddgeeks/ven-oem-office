import { getConnection, getConnectionManager } from 'typeorm';

export async function closeAllConnection() {
  return getConnectionManager().connections.map(
    async (i) => await getConnection(i.name).close(),
  );
}
