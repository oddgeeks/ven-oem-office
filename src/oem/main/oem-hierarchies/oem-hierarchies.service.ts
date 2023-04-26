import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Connection, TreeRepository, FindOneOptions, In } from 'typeorm';

import { Hierarchy, OemHierarchyEntity } from './oem-hierarchy.entity';
import { HierarchyCreateDto } from './oem-hierarchy.dto/oem-hierarchy.create.dto';
import { HierarchyDto } from './oem-hierarchy.dto/oem-hierarchy.dto';
import { HierarchyUpdateDto } from './oem-hierarchy.dto/oem-hierarchy.update.dto';
import { OemHierarchyDeleteDto } from './oem-hierarchy.dto/oem-hierarchy.delete.dto';
import { HierarchyReplaceDto } from './oem-hierarchy.dto/oem-hierarchy.replace.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

//TODO: add transaction decorator
// was done 29.07.22
@Injectable()
@CommonDefaultMethodExtension
export class OemHierarchiesService extends TypeOrmCrudService<OemHierarchyEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemHierarchyEntity)
    public repo: TreeRepository<OemHierarchyEntity>,
  ) {
    super(repo);
  }

  protected async setParent(
    entity: Hierarchy,
    dto: Partial<HierarchyDto>,
  ): Promise<Hierarchy> {
    if (dto.parentId) {
      const parent = await this.repo.findOne({ hierarchyId: dto.parentId });

      if (parent) {
        entity.parent = parent;
        entity.parentId = dto.parentId;
      }
    }
    return entity;
  }

  protected async setActive(entity: Hierarchy, dto: Partial<HierarchyDto>) {
    if (typeof dto.isActive !== 'undefined' && dto.isActive !== null) {
      const children = await this.repo.findDescendants(entity);
      const ids = children.map((child) => child.hierarchyId);

      await this.repo.update(
        {
          hierarchyId: In(ids),
        },
        {
          isActive: dto.isActive,
        },
      );
    }
  }

  private async _findOne(
    params: FindOneOptions<Hierarchy>,
    /*| string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Hierarchy>
      | Partial<Hierarchy>,*/
  ): Promise<Hierarchy> {
    const entity: Hierarchy = await this.repo.findOne(params);

    if (!entity) {
      throw new NotFoundException('Hierarchy not found');
    }

    return entity;
  }

  public async createOne(
    req: CrudRequest,
    dto: Partial<HierarchyCreateDto>,
  ): Promise<Hierarchy> {
    return this.connection.transaction(async (manager) => {
      let entity: Hierarchy = new Hierarchy(dto);

      entity = await this.setParent(entity, dto);
      return await this.repo.save(entity);
    });
  }

  public async updateOne(
    req: CrudRequest,
    dto: Partial<HierarchyUpdateDto>,
  ): Promise<Hierarchy> {
    const id = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );
    let entity: Hierarchy = await this._findOne({
      [id.field]: id.value,
    });
    entity = { ...entity, ...dto };

    entity = await this.setParent(entity, dto);
    entity = await this.repo.save(entity);
    await this.setActive(entity, dto);
    return entity;
  }

  public async replaceOne(
    req: CrudRequest,
    dto: Partial<HierarchyReplaceDto>,
  ): Promise<Hierarchy> {
    const id = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );
    let entity: Hierarchy = await this._findOne({
      [id.field]: id.value,
    });

    entity = { ...entity, ...dto };

    if (!entity) {
      entity = new Hierarchy(dto);
    }

    entity = await this.setParent(entity, dto);
    entity = await this.repo.save(entity);
    await this.setActive(entity, dto);
    return entity;
  }

  public async deleteWithReplacement(params: OemHierarchyDeleteDto) {
    const { hierarchyId, replacementHierarchyId } = params;
    const hierarchy = await this.repo.findOne(hierarchyId);
    if (!hierarchy) {
      throw new NotFoundException('Hierarchy not found');
    }

    const replacementHierarchy = await this.repo.findOne(
      replacementHierarchyId,
    );
    if (!replacementHierarchy) {
      throw new NotFoundException('Replacement hierarchy not found');
    }

    const subHierarchies = await this.repo.findDescendants(hierarchy);
    const subHierarchyIds = subHierarchies.map((h) => h.hierarchyId);
    const hierarchyIds = [hierarchyId, ...subHierarchyIds];

    return this.repo.manager.transaction(async (manager) => {
      const relations = this.repo.metadata.ownRelations
        .map((relation) => relation.inverseEntityMetadata)
        .filter(
          (relation) =>
            Object.keys(relation.propertiesMap).includes('geoHierarchyId') ||
            Object.keys(relation.propertiesMap).includes('productHierarchyId'),
        );
      // replace the existing relations
      for (const relation of relations) {
        const condition = Object.keys(relation.propertiesMap).includes(
          'geoHierarchyId',
        )
          ? {
              geoHierarchyId: In(hierarchyIds),
            }
          : {
              productHierarchyId: In(hierarchyIds),
            };

        const entities = await manager.find(relation.targetName, condition);
        for (const entity of entities) {
          await manager.save(
            manager.getRepository(relation.targetName).create({
              ...entity,
              geoHierarchyId: replacementHierarchyId,
              productHierarchyId: replacementHierarchyId,
            }),
          );
        }
      }

      // delete sub hierarchies
      await manager.delete(OemHierarchyEntity, {
        hierarchyId: In(subHierarchyIds),
      });

      // delete the parent
      await manager.delete(OemHierarchyEntity, {
        hierarchyId,
      });

      return replacementHierarchy;
    });
  }
}
