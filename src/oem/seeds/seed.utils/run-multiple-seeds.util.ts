import { SeederConstructor } from 'typeorm-seeding/dist/types';
import { BaseEntity } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

export async function RunMultipleSeeds(
  seeders: Array<SeederConstructor>,
): Promise<BaseEntity[]> {
  const results: BaseEntity[] = [];
  for (const seeder of seeders) {
    results.push((await runSeeder(seeder)) as BaseEntity);
  }
  return results;
}
