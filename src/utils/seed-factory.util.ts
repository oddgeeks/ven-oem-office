import { Connection } from 'typeorm';

export async function seedEntities<Entity>(
  connection: Connection,
  entityClass: { new (...args: any[]): any },
  seedInputs: Partial<Entity>[],
) {
  if (seedInputs.length === 0) {
    return [];
  }

  // run with query builder instead of factory to override auto increment primary keys and bulk insert
  const insertResult = await connection
    .createQueryBuilder()
    .insert()
    .into(entityClass, Object.keys(seedInputs[0]))
    .values(seedInputs as any[])
    .execute();

  return insertResult.generatedMaps;
}
