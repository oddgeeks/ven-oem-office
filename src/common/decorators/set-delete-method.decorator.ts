import { NotFoundException } from '@nestjs/common';
import { BaseEntity, EntityManager, In, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { CrudRequest } from '@nestjsx/crud';
import { BulkIdsDto } from '../dtos/bulk-ids.dto';

/**
 Decorator which overrides deleteOne methods, instead of deleting it changes isEnabled to false
 */
export function SetDeleteMethod<T extends { new (...args: any[]): any }>(
  target: T,
) {
  const decoratedClass = class extends target {
    constructor(...args: any[]) {
      super(...args);
      target.prototype.__proto__.deleteOne = (...args: any[]): any => {
        return;
      };
    }

    _getPrimaryKeys(repo?: Repository<BaseEntity>) {
      const _repo = repo || this.repo;
      return _repo.metadata.primaryColumns.map(
        (item: ColumnMetadata) => item.propertyName,
      );
    }

    _getFindParams(req: CrudRequest) {
      let id = req.parsed.paramsFilter.find(
        (params) => params?.field === req.options.params.id?.field,
      )?.value;

      if (this.repo.metadata.hasMultiplePrimaryKeys === true) {
        id = {};
        req.parsed.paramsFilter.forEach((param) => {
          id[param?.field] = param?.value;
        });
      }
      return id;
    }

    async _deleteEntity(
      exemplar: BaseEntity,
      manager: EntityManager,
    ): Promise<BaseEntity> {
      const deactivatedExemplar = await manager.save(
        this.repo.create({
          ...exemplar,
          isEnabled: false,
        }),
      );

      // Exclude relations with multiple primary keys from deactivation, like CompanyAddresses, QuotesUsers, VendosUsers
      if (this.repo.metadata.hasMultiplePrimaryKeys) {
        return deactivatedExemplar;
      }

      const primaryKeys = this.repo.metadata.ownColumns
        .filter((value) => value.isPrimary === true)
        .map((value) => value.propertyName);

      for (const primaryKey of primaryKeys) {
        const relations = this.repo.metadata.ownRelations
          .map((relation) => relation.inverseEntityMetadata)
          .filter(
            (relation) =>
              (relation.ownColumns
                .map((column) => column?.referencedColumn?.propertyPath)
                .includes(primaryKey) ||
                Object.keys(relation.propertiesMap).includes(primaryKey)) &&
              Object.keys(relation.propertiesMap).includes('isEnabled'),
          );
        for (const relation of relations) {
          const foreignKeys = relation.ownColumns.filter(
            (column) => column?.referencedColumn?.propertyPath === primaryKey,
          );
          const entities = await manager.find(relation.targetName, {
            where: [
              ...foreignKeys.map(
                (fk) =>
                  new Object({
                    [fk.propertyPath || primaryKey]:
                      deactivatedExemplar[primaryKey],
                  }),
              ),
            ],
          });
          const createdEntities = [];
          for (const entity of entities) {
            const data = Object.assign(entity, { isEnabled: false });

            createdEntities.push(
              manager.getRepository(relation.targetName).create(data),
            );
          }
          await manager.save(relation.targetName, createdEntities);
        }
      }
      return deactivatedExemplar;
    }

    async deleteBulk(req: CrudRequest, dto: BulkIdsDto) {
      return this.repo.manager.transaction(async (manager) => {
        const deactivatedExemplars = [];
        const primaryKey = this._getPrimaryKeys()[0];
        const ids = dto.bulk.map((item) => item[primaryKey]);
        const exemplars =
          ids &&
          (await this.repo.find({
            [primaryKey]: In([...ids]),
          }));

        if (!exemplars || (exemplars && exemplars.length == 0)) {
          throw new NotFoundException(
            `${this.repo.metadata.targetName} not found`,
          );
        }

        for (const exemplar of exemplars) {
          deactivatedExemplars.push(
            await this._deleteEntity(exemplar, manager),
          );
        }
        return deactivatedExemplars;
      });
    }

    async deleteOne(...args: any[]) {
      await super.deleteOne.call(this, ...args);
      return this.repo.manager.transaction(async (manager) => {
        const req = args[0];
        //console.log(req.parsed.paramsFilter, req.options);
        const params = this._getFindParams(req);

        const exemplar = params && (await this.repo.findOne(params));
        if (!exemplar) {
          throw new NotFoundException(
            `${this.repo.metadata.targetName} not found`,
          );
        }
        return this._deleteEntity(exemplar, manager);
      });
    }
  };
  Object.defineProperty(decoratedClass, 'name', {
    value: target.name,
  });
  return decoratedClass;
}
