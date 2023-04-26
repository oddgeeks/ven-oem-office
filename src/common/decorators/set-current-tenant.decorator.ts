import { Inject } from '@nestjs/common';
import { TenantsService } from '../../shared/tenants/tenants.service';
import { Repository, getConnection, Connection } from 'typeorm';
import { explainQR } from '../../utils/explain-qr.util';
import { TYPEORM_EXPLAIN } from '../../environments';
import { copyMetadata } from '../../utils/copy-metadata.util';

/**
 ** DEPRECATED
 * Decorator for injecting current tenant; We need to use SET LOCAL,
 * bc we have only 1 connection for every company
 * (maybe in future we might have each connection for each company with their user)
 * For providing common connection, we need to wrap each request by transaction.
 * We use all repositories which we reset by query builder, so it allows us to add setCurrentTenancy to each transaction.
 * We wrap all method by transaction, if they present in service.
 * -----------
 * UPDATE (24.09.22):
 * We refactored this one, we DO NOT cover it by transactions anymore!
 * It gets connection with tenant name (we check and create connection in connection.middleware.ts)
 * we open a new session (createQueryRunner, yea typeorm open new session for each queryRunner, works for postgres) per each method
 * and put SET SESSION current_tenant.
 */
export function SetCurrentTenant<T extends { new (...args: any[]): any }>(
  target: T,
) {
  const injectTenantsService = Inject(TenantsService);

  const decoratedClass = class extends target {
    public tenantsService: TenantsService;

    constructor(...args: any[]) {
      super(...args);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const selfDecoratedClass = this;

      /**
       * getting all possible repositories in a decorated class and wrap queryRunner
       */
      /*   for (const u in this) {
           if (this.hasOwnProperty(u) && (this[u] as any) instanceof Repository) {
             const selfManager = this[u].manager;
             // eslint-disable-next-line @typescript-eslint/no-this-alias
             const self = this;
             return;
             //console.log(repo.metadata.targetName)
             const originalQueryRunner = this[u].manager.connection.createQueryRunner;
             this[u].manager.queryRunner =
               this[u].manager.queryRunner ||
               this[u].manager.connection.createQueryRunner();
             if (!this[u].manager.queryRunner.wrapped) {
               const originalStartTransaction =
                 this[u].manager.queryRunner.startTransaction;

               this[u].manager.queryRunner.startTransaction = async (
                 ...args: any[]
               ) => {
                 //console.log(repo.metadata.targetName);
                 const tenantId = (
                   await self.tenantsService.getTenantFromNamespace()
                 ).tenantId;
                 const res = await originalStartTransaction.call(
                   selfManager.queryRunner,
                   ...args,
                 );
                 await self.tenantsService.setCurrentTenantOnQueryRunner(
                   selfManager.queryRunner,
                   tenantId,
                 );
                 return res;
               };
               this[u].manager.queryRunner.wrapped = true;
             }
             //we create manually bc might not exists *!/
             /!* const originalQueryBuilder = this[u].manager.createQueryBuilder;

                this[u].manager.createQueryBuilder = (...args) => {
                  return originalQueryBuilder.call(selfManager, ...args);
                  /!*console.log(res);
                  return res;*!/
                };*!/
             //console.log(Object.getOwnPropertyDescriptors(repo));
             /!* this[u].manager.createQueryBuilder = (
                entityClass,
                alias,
                queryRunner,
              ) => {
                //self.tenantsService.setCurrentTenantOnQueryRunner(selfManager);
                if (alias) {
                  return selfManager.connection.createQueryBuilder(
                    entityClass,
                    alias,
                    queryRunner || self.queryRunner,
                  );
                } else {
                  return selfManager.connection.createQueryBuilder(
                    entityClass || queryRunner || self.queryRunner,
                  );
                }
              };*!/

             /!* /!**
               * wrap setting tenant for manager transaction
               *!/
              console.log(this[u].manager.connection.transaction);
              const originalTransaction = this[u].manager.connection.transaction;
              if (!this[u].manager.connection.transaction.wrapped) {
                this[u].manager.connection.transaction = async (...args: any[]) => {
                  const getCbIndex = () => (args[1] === undefined ? 0 : 1);
                  const cb = args[getCbIndex()];
                  if (cb !== undefined) {
                    args[getCbIndex()] = async function(manager: EntityManager) {
                      await self.tenantsService.setCurrentTenantOnRepository(
                        manager.getRepository(repo.metadata.targetName),
                      );
                      return await cb.call(self, manager);
                    };
                  }
                  return await originalTransaction.call(selfManager, ...args);
                };
                this[u].manager.connection.transaction.wrapped = true;
              }*!/
             /!*const BASIC_METHODS = ['findOne'];
             BASIC_METHODS.forEach(async (method) => {
               const originalMethod = repo.manager[method];
               if (!repo.manager[method].wrapped) {
                 repo.manager[method] = async function(...args) {
                   return await repo.manager.transaction(async (manager) => {
                     return await originalMethod.call(this, ...args);
                   });
                 };
               }
               repo.manager[method].wrapped = true;
             });*!/
           }
         }*/

      /* /!**
        * Wrap connection
        *!/
       const originalTransaction = this.connection?.transaction;
       const selfConnection = this.connection;
       const selfRepo = this.repo;
       if (this.connection && !this.connection.transaction.wrapped) {
         this.connection.transaction = async (...args: any[]) => {
           const getCbIndex = () => (args[1] === undefined ? 0 : 1);
           const cb = args[getCbIndex()];
           if (cb !== undefined) {
             args[getCbIndex()] = async function(manager: EntityManager) {
               await selfDecoratedClass.tenantsService.setCurrentTenantOnRepository(
                 manager.getRepository(selfRepo.metadata.targetName),
               );
               return await cb.call(this, manager);
             };
           }
           return await originalTransaction.call(selfConnection, ...args);
         };
         this.connection.transaction.wrapped = true;
       }*/

      /**
       * get all methods in decorated class
       */
      const descriptors = Object.getOwnPropertyDescriptors(
        // for overriding all extends methods use Object.getPrototypeOf(target.prototype),
        // but in that case you might get an issue when initialization db requests cannot get the current tenant
        // (bc we get it via headers, but service requests cannot get this info)
        target.prototype,
      );

      /*const descriptors = {
        ...Object.getOwnPropertyDescriptors(decoratedClass.prototype),
        ...Object.getOwnPropertyDescriptors(target.prototype),
      };*/
      for (const [propertyName, descriptor] of Object.entries(descriptors)) {
        const isMethod =
          typeof descriptor.value == 'function' &&
          propertyName != 'constructor';
        if (!isMethod) continue;

        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
          return await selfDecoratedClass._wrapQueryRunner(
            originalMethod,
            args,
          );
        };

        if (originalMethod != descriptor.value) {
          copyMetadata(originalMethod, descriptor.value);
        }

        Object.defineProperty(target.prototype, propertyName, descriptor);
      }
    }

    /**
     * override basic methods which weren't be collected from previous methods (bc of extends), we can lost "this"(self) context (when use @Override() in controller),
     * that's why we should setting context directly
     */

    async _wrapQueryRunner(method, args) {
      let repo;
      let connection: Connection;
      const self = this;

      async function wrapTenantConnection() {
        try {
          const tenant = await self.tenantsService.getTenantFromNamespace();
          if (tenant) {
            const tenantConnection: Connection = getConnection(tenant.name);

            const descriptor = Object.getOwnPropertyDescriptor(
              Connection.prototype,
              'createQueryRunner',
            );
            const originalCreateQueryRunner = descriptor.value;

            descriptor.value = (...args: any) => {
              const queryRunner = originalCreateQueryRunner.apply(
                tenantConnection,
                args,
              );

              //be carefully it might impact on performance
              if (TYPEORM_EXPLAIN === 'true') {
                explainQR(queryRunner);
              }

              self.tenantsService.setCurrentTenantOnQueryRunner(
                queryRunner,
                tenant.tenantId,
              );
              return queryRunner;
            };
            if (originalCreateQueryRunner != descriptor.value) {
              copyMetadata(originalCreateQueryRunner, descriptor.value);
            }

            Object.defineProperty(
              tenantConnection,
              'createQueryRunner',
              descriptor,
            );

            return tenantConnection;
          }
        } catch (e) {
          // console.log('Ignoring tenant', method.name);
        }
      }

      /*
            async function wrapTenantConnection() {
              try {
                const tenant = await self.tenantsService.getTenantFromNamespace();
                if (tenant) {
                  const tenantConnection: Connection = getConnection(tenant.name);
                  const originalCreateQueryRunner = tenantConnection.createQueryRunner;

                  tenantConnection.createQueryRunner = (...args: any) => {
                    const queryRunner = originalCreateQueryRunner.call(
                      tenantConnection,
                      ...args,
                    );
                    self.tenantsService.setCurrentTenantOnQueryRunner(
                      queryRunner,
                      tenant.tenantId,
                    );
                    return queryRunner;
                  };
                  return tenantConnection;
                }
              } catch (e) {
                // console.log('Ignoring tenant', method.name);
              }
            }*/

      // it create a new session
      //const queryRunner = tenantConnection.createQueryRunner();

      // we need to find all repos for getting manager and connection
      for (const u in this) {
        if (this.hasOwnProperty(u) && (this[u] as any) instanceof Repository) {
          repo = this[u];
          //setting our tenant queryRunner;
          //repo.manager.queryRunner = queryRunner;
          if (
            !['MASTER_CONNECTION', 'MASTER_CONNECTION_CONF'].includes(
              repo.manager.connection.name,
            )
          ) {
            repo.manager.connection =
              (await wrapTenantConnection()) || repo.manager.connection;
          }
        }
        // setting connection
        if (this.hasOwnProperty(u) && (this[u] as any) instanceof Connection) {
          connection = this[u];
          if (
            !['MASTER_CONNECTION', 'MASTER_CONNECTION_CONF'].includes(
              connection.name,
            )
          ) {
            connection = (await wrapTenantConnection()) || connection;
          }
        }
      }
      // it opens new session
      //await queryRunner.connect();
      const res = await method.call(this, ...args);
      // it closes session
      //await repo.manager.queryRunner.release();
      //await queryRunner.release();
      return res;
    }

    async createOne(...args: any[]) {
      return this._wrapQueryRunner(super.createOne, args);
    }

    async getOne(...args: any[]) {
      return this._wrapQueryRunner(super.getOne, args);
    }

    async getMany(...args: any[]) {
      return this._wrapQueryRunner(super.getMany, args);
    }

    async updateOne(...args: any[]) {
      return this._wrapQueryRunner(super.updateOne, args);
    }

    async replaceOne(...args: any[]) {
      return this._wrapQueryRunner(super.replaceOne, args);
    }

    async createMany(...args: any[]) {
      return this._wrapQueryRunner(super.createMany, args);
    }

    async deleteOne(...args: any[]) {
      //return this._wrapQueryRunner(super.deleteOne, args);
      return decoratedClass.prototype._wrapQueryRunner.call(
        this['service'] || this,
        super.deleteOne,
        args,
      );
    }
  };
  Object.defineProperty(decoratedClass, 'name', {
    value: target.name,
  });
  injectTenantsService(decoratedClass.prototype, 'tenantsService');
  return decoratedClass;
}
