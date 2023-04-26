import { NotFoundException } from '@nestjs/common';
import { omit, cloneDeep, forEach } from 'lodash';
import {
  BaseEntity,
  EntityManager,
  EntityMetadata,
  In,
  Repository,
} from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { CrudRequest } from '@nestjsx/crud';
import { BulkIdsDto } from '../dtos/bulk-ids.dto';
import { lookup } from '../../utils/lookup.util';

/**
 * HOW TO ADD CONTROLLER CLASS DECORATOR WITH DECORATED METHOD
 * you can follow SetCurrentUser class decorator
 but to be able to use a method decorator inside, you need to create an abstract class (CloneController), where you use \@POST(:id/clone)
 method{}
 and then in your class decorator (SetCloneController) should be smith like:
 applyMixins(DecoratedClass, [CloneController, target])
 const DecoratedClass = {
    …your additional overriding functions
}
 it would be great to have this pattern for future our future feats, to keep SOLID as much as possible
 */
export function SetCloneMethod(clonedRelations: string[] = []) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    const decoratedClass = class extends target {
      constructor(...args: any[]) {
        super(...args);
      }

      _cloneParamsWith(clonedObject, property, replaceValue) {
        function iteratee(val) {
          // Base case
          if (!val || (typeof val !== 'object' && !Array.isArray(val))) {
            return;
          }

          // Recursively apply iteratee
          forEach(val, iteratee);

          // Perform check
          if (val.hasOwnProperty(property)) {
            Object.assign(val, { [property]: replaceValue });
          }
        }

        return forEach(clonedObject, iteratee);
      }

      _getPrimaryKeys(repo?: Repository<BaseEntity>) {
        const _repo: Repository<BaseEntity> = repo || this.repo;
        return _repo.metadata.primaryColumns.map(
          (item: ColumnMetadata) => item.propertyName,
        );
      }

      _getSingleUniqueColumns(repo?: Repository<BaseEntity>) {
        const _repo: Repository<BaseEntity> = repo || this.repo;
        return _repo.metadata.ownUniques
          .filter((item) => item.givenColumnNames.length === 1)
          .map((item) => item.givenColumnNames[0]);
      }

      async _getClonedData(originalEntity: BaseEntity, manager: EntityManager) {
        if (super.getClonedData) {
          return super.getClonedData(originalEntity, manager);
        }

        const originalPrimaryKey = this._getPrimaryKeys()[0];
        const name = lookup('Name', originalEntity);

        return {
          ...omit(originalEntity, [
            originalPrimaryKey,
            'createdAt',
            'updatedAt',
          ]),
          isLocked: false,
          [name]: `Cloned from ${originalEntity[name]}`,
        };
      }

      async _cloneEntity(
        originalEntity: BaseEntity,
        manager: EntityManager,
      ): Promise<BaseEntity> {
        const originalPrimaryKey = this._getPrimaryKeys()[0];
        const originalId = originalEntity[originalPrimaryKey];
        const clonedData = await this._getClonedData(originalEntity, manager);
        const clonedEntity = await manager.save(this.repo.create(clonedData));

        const relations: EntityMetadata[] = this.repo.metadata.ownRelations
          .map((relation: RelationMetadata) => relation.inverseEntityMetadata)
          .filter(
            (entity: EntityMetadata) =>
              Object.keys(entity.propertiesMap).includes(originalPrimaryKey) &&
              clonedRelations.includes(entity.targetName),
          );

        for (const relation of relations) {
          const entities: any[] = await manager.find(relation.targetName, {
            where: {
              [originalPrimaryKey]: originalId,
            },
          });
          const createdEntities = [];

          const repo: Repository<any> = manager.getRepository(
            relation.targetName,
          );
          const primaryKeysToExclude = repo.metadata.hasMultiplePrimaryKeys
            ? []
            : this._getPrimaryKeys(repo);
          const uniqueColumnsToExclude = this._getSingleUniqueColumns(repo);

          for (const entity of entities) {
            createdEntities.push(
              repo.create({
                ...omit(entity, [
                  ...primaryKeysToExclude,
                  ...uniqueColumnsToExclude,
                  'createdAt',
                  'updatedAt',
                ]),
                [originalPrimaryKey]: clonedEntity[originalPrimaryKey],
                isLocked: false,
              }),
            );
          }

          await manager.save(relation.targetName, createdEntities);
        }
        return clonedEntity;
      }

      //TODO: probably we would need to have a job here
      async cloneBulk(
        req: CrudRequest,
        dto: BulkIdsDto,
      ): Promise<Array<BaseEntity>> {
        const originalPrimaryKey = this._getPrimaryKeys()[0];
        const originalIds = dto.bulk.map((item) => item[originalPrimaryKey]);
        const clonedEntities = await this.repo.manager.transaction(
          async (manager: EntityManager) => {
            const originalEntities =
              originalIds &&
              (await this.repo.find({
                [originalPrimaryKey]: In([...originalIds]),
              }));

            if (
              !originalEntities ||
              (originalEntities && originalEntities.length == 0)
            ) {
              throw new NotFoundException(
                `${this.repo.metadata.targetName} not found`,
              );
            }
            const clonedEntities = [];
            for (const originalEntity of originalEntities) {
              clonedEntities.push(
                await this._cloneEntity(originalEntity, manager),
              );
            }
            return clonedEntities;
          },
        );
        //for supporting crud framework
        const copyReq = cloneDeep(req);
        for (const clonedEntity of clonedEntities) {
          copyReq.parsed.search['$or'] = copyReq.parsed.search['$or'] || [];
          let searchOr = {};
          copyReq.parsed.search['$and'].forEach((item) => {
            searchOr = {
              ...searchOr,
              ...item,
              [originalPrimaryKey]: clonedEntity[originalPrimaryKey],
            };
          });
          copyReq.parsed.search['$or'].push(searchOr);
        }
        copyReq.parsed.search['$and'] = [];
        return super.getMany(copyReq);
      }

      async clone(req: CrudRequest) {
        const isPrimaryId = (params) =>
          params.field === req.options.params.id.field;
        const primaryKey = this._getPrimaryKeys()[0];
        const clonedEntity = await this.repo.manager.transaction(
          async (manager: EntityManager) => {
            const originalId = req.parsed.paramsFilter.find(isPrimaryId);
            const originalEntity =
              originalId && (await this.repo.findOne(originalId?.value));

            if (!originalEntity) {
              throw new NotFoundException(
                `${this.repo.metadata.targetName} not found`,
              );
            }
            return await this._cloneEntity(originalEntity, manager);
          },
        );
        //for supporting crud framework
        const copyReq = cloneDeep(req);
        copyReq.parsed.paramsFilter[
          copyReq.parsed.paramsFilter.findIndex(isPrimaryId)
        ].value = clonedEntity[primaryKey];
        copyReq.parsed.search = this._cloneParamsWith(
          copyReq.parsed.search,
          primaryKey,
          clonedEntity[primaryKey],
        );
        return super.getOneOrFail(copyReq);
      }
    };

    Object.defineProperty(decoratedClass, 'name', {
      value: target.name,
    });

    return decoratedClass;
  };
}
