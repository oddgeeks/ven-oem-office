import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemHierarchyEntity } from '../main/oem-hierarchies/oem-hierarchy.entity';

export default class CreateOemHierarchies implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // TODO: update demo/clean seeds
    const GEOHierarchies: Array<OemHierarchyEntity> = [];
    // Global
    GEOHierarchies[0] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 1,
      hierarchyName: 'Global',
    });

    //NORTH AMERICA
    GEOHierarchies[1] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 2,
      hierarchyName: 'North America',
      parentId: GEOHierarchies[0].hierarchyId,
      parent: GEOHierarchies[0],
    });
    //country
    GEOHierarchies[2] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 3,
      parentId: GEOHierarchies[1].hierarchyId,
      hierarchyName: 'USA',
      parent: GEOHierarchies[1],
    });
    //region
    GEOHierarchies[3] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 4,
      parentId: GEOHierarchies[2].hierarchyId,
      hierarchyName: 'New York',
      parent: GEOHierarchies[2],
    });
    GEOHierarchies[5] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 4,
      parentId: GEOHierarchies[2].hierarchyId,
      hierarchyName: 'California',
      parent: GEOHierarchies[2],
    });
    //city
    GEOHierarchies[4] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 5,
      parentId: GEOHierarchies[3].hierarchyId,
      hierarchyName: 'New York City',
      parent: GEOHierarchies[3],
    });
    GEOHierarchies[6] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 5,
      parentId: GEOHierarchies[5].hierarchyId,
      hierarchyName: 'San Francisco',
      parent: GEOHierarchies[5],
    });
    await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 6,
      hierarchyName: 'District',
    });
    GEOHierarchies[6] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 7,
      hierarchyName: 'Geo LV-6',
    });
    GEOHierarchies[7] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 8,
      hierarchyName: 'Geo LV-7',
    });
    GEOHierarchies[8] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 9,
      hierarchyName: 'Geo LV-8',
    });

    //EUROPE
    GEOHierarchies[9] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 2,
      hierarchyName: 'Europe',
      parentId: GEOHierarchies[0].hierarchyId,
      parent: GEOHierarchies[0],
    });
    //country
    GEOHierarchies[10] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 3,
      parentId: GEOHierarchies[9].hierarchyId,
      hierarchyName: 'England',
      parent: GEOHierarchies[9],
    });
    GEOHierarchies[13] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 3,
      parentId: GEOHierarchies[9].hierarchyId,
      hierarchyName: 'Ukraine',
      parent: GEOHierarchies[9],
    });
    //region
    GEOHierarchies[11] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 4,
      parentId: GEOHierarchies[10].hierarchyId,
      hierarchyName: 'London',
      parent: GEOHierarchies[10],
    });
    GEOHierarchies[14] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 4,
      parentId: GEOHierarchies[13].hierarchyId,
      hierarchyName: `Kyivska oblast'`,
      parent: GEOHierarchies[13],
    });
    //city
    GEOHierarchies[12] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 5,
      parentId: GEOHierarchies[11].hierarchyId,
      hierarchyName: 'London',
      parent: GEOHierarchies[11],
    });
    GEOHierarchies[15] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 5,
      parentId: GEOHierarchies[14].hierarchyId,
      hierarchyName: `Kyiv'`,
      parent: GEOHierarchies[14],
    });

    //ASIA
    GEOHierarchies[16] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 2,
      hierarchyName: 'Asia',
      parentId: GEOHierarchies[0].hierarchyId,
      parent: GEOHierarchies[0],
    });
    //country
    GEOHierarchies[17] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 3,
      parentId: GEOHierarchies[16].hierarchyId,
      hierarchyName: 'China',
      parent: GEOHierarchies[16],
    });
    //region
    GEOHierarchies[18] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 4,
      parentId: GEOHierarchies[17].hierarchyId,
      hierarchyName: 'Province',
      parent: GEOHierarchies[17],
    });
    //city
    GEOHierarchies[19] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 5,
      parentId: GEOHierarchies[18].hierarchyId,
      hierarchyName: 'Shanghai',
      parent: GEOHierarchies[18],
    });

    //Product Hierarchies

    const EDITIONS = ['None', 'Standard', 'Premium', 'Upgrade'];
    const VERTICALS = ['None', 'Virtual', 'On-Prem'];
    const LICENSING_MODELS = ['None', 'Subscription'];
    const PATHS = ['None', 'Add-On'];

    const ProductHierarchies: Array<OemHierarchyEntity> = [];
    ProductHierarchies[0] = await factory(OemHierarchyEntity)().create({
      hierarchyLevelId: 10,
      hierarchyName: 'Global',
    });

    for (let i = 1; i <= EDITIONS.length; i++) {
      ProductHierarchies[i] = await factory(OemHierarchyEntity)().create({
        hierarchyLevelId: 11,
        hierarchyName: EDITIONS[i - 1],
      });
      for (let j = 1; j <= VERTICALS.length; j++) {
        ProductHierarchies[j + EDITIONS.length] = await factory(
          OemHierarchyEntity,
        )().create({
          hierarchyLevelId: 12,
          parentId: ProductHierarchies[i].hierarchyId,
          hierarchyName: VERTICALS[j - 1],
          parent: ProductHierarchies[i],
        });
        for (let k = 1; k <= LICENSING_MODELS.length; k++) {
          ProductHierarchies[k + EDITIONS.length + VERTICALS.length] =
            await factory(OemHierarchyEntity)().create({
              hierarchyLevelId: 13,
              parentId: ProductHierarchies[j + EDITIONS.length].hierarchyId,
              hierarchyName: LICENSING_MODELS[k - 1],
              parent: ProductHierarchies[j + EDITIONS.length],
            });

          for (let n = 1; n <= PATHS.length; n++) {
            ProductHierarchies[
              n + EDITIONS.length + VERTICALS.length + PATHS.length
            ] = await factory(OemHierarchyEntity)().create({
              hierarchyLevelId: 14,
              parentId:
                ProductHierarchies[k + EDITIONS.length + VERTICALS.length]
                  .hierarchyId,
              hierarchyName: PATHS[n - 1],
              parent:
                ProductHierarchies[k + EDITIONS.length + VERTICALS.length],
            });
          }
        }
      }
    }

    ProductHierarchies[ProductHierarchies.length] = await factory(
      OemHierarchyEntity,
    )().create({
      hierarchyLevelId: 15,
      hierarchyName: 'Product LV-5',
    });

    ProductHierarchies[ProductHierarchies.length] = await factory(
      OemHierarchyEntity,
    )().create({
      hierarchyLevelId: 16,
      hierarchyName: 'Product LV-6',
    });
    ProductHierarchies[ProductHierarchies.length] = await factory(
      OemHierarchyEntity,
    )().create({
      hierarchyLevelId: 17,
      hierarchyName: 'Product LV-7',
    });
    ProductHierarchies[ProductHierarchies.length] = await factory(
      OemHierarchyEntity,
    )().create({
      hierarchyLevelId: 18,
      hierarchyName: 'Product LV-8',
    });
    return GEOHierarchies[1];
  }
}
