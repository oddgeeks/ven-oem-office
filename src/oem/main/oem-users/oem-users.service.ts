import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { OemUserEntity } from './oem-user.entity';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';

import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';

import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';

import { OemUserReplaceDto } from './oem-user.dto/oem-user.replace.dto';
import { OemUserDeleteDto } from './oem-user.dto/oem-user.delete.dto';
import { OemUserRoleReassignDto } from './oem-user.dto/oem-user.role-reassign.dto';
import { RoleTypeEnum } from '../oem-roles/oem-role.enums/role-type.enum';
import { Repository } from 'typeorm';

@Injectable()
@SetCurrentTenant
export class OemUsersService extends TypeOrmCrudService<OemUserEntity> {
  constructor(
    @InjectRepository(OemUserEntity) public repo: Repository<OemUserEntity>,
  ) {
    super(repo);
  }

  public async register(data: Partial<OemUserEntity>): Promise<OemUserEntity> {
    let user: OemUserEntity = await this.repo.findOne({
      ssoLoginEmail: data.ssoLoginEmail,
    });
    if (!user) {
      user = await this.repo.save(new OemUserEntity(data));
    }
    return user;
  }

  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemUserReplaceDto>,
  ): Promise<OemUserEntity> {
    const userId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );

    const user = await this.repo.findOne(userId.value);
    if (user) {
      const replacedUser = await this.repo.save(
        this.repo.create({
          ...user,
          ...dto,
        }),
      );

      return this.repo.findOne(replacedUser.userId, {
        relations: ['geoHierarchy'],
      });
    }

    return super.replaceOne(req, dto);
  }

  async updateOne(
    req: CrudRequest,
    dto: Partial<OemUserReplaceDto>,
  ): Promise<OemUserEntity> {
    const userId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );

    const user = await this.repo.findOne(userId.value);
    if (user) {
      const replacedUser = await this.repo.save(
        this.repo.create({
          ...user,
          ...dto,
        }),
      );

      return this.repo.findOne(replacedUser.userId, {
        relations: ['geoHierarchy'],
      });
    }

    return super.updateOne(req, dto);
  }

  //TODO(minor): validation should be moved to DTO
  //TODO(refactor): we can get our own relation in meta - it's a bit wrong to hardcode it
  async reassign(params: { id: number; targetUserId: number }) {
    const { id, targetUserId } = params;
    const sourceUser = await this.repo.findOne(id, {
      relations: [
        'quotes',
        'usersQuotes',
        'quoteApprovalQueues',
        'vendos',
        'vendosUsers',
        'vendoApprovalQueues',
      ],
    });
    if (!sourceUser) {
      throw new NotFoundException('Source user not found');
    }

    const targetUser = await this.repo.findOne(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    await this.repo.manager.transaction(async (manager) => {
      // reassign all quotes to the target user
      for (const quote of sourceUser.quotes) {
        await manager.update(
          OemQuoteEntity,
          {
            quoteId: quote.quoteId,
            isEnabled: true,
          },
          {
            ownerUserId: targetUserId,
          },
        );
      }

      for (const quoteUser of sourceUser.usersQuotes) {
        await manager.update(
          OemQuotesUsers,
          {
            quoteId: quoteUser.quoteId,
            userId: quoteUser.userId,
            isEnabled: true,
          },
          {
            userId: targetUserId,
          },
        );
      }

      for (const quoteApprovalQueue of sourceUser.quoteApprovalQueues) {
        await manager.update(
          OemQuoteApprovalQueue,
          {
            quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
            isEnabled: true,
            isActive: true,
          },
          {
            userId: targetUserId,
          },
        );
      }

      // reassign all vendos to the target user
      for (const vendo of sourceUser.vendos) {
        await manager.update(
          OemVendoEntity,
          {
            vendoId: vendo.vendoId,
            isEnabled: true,
          },
          {
            ownerUserId: targetUserId,
          },
        );
      }

      for (const vendoUser of sourceUser.vendosUsers) {
        await manager.update(
          OemVendosUsers,
          {
            vendoId: vendoUser.vendoId,
            userId: vendoUser.userId,
            isEnabled: true,
          },
          {
            userId: targetUserId,
          },
        );
      }

      for (const vendoApprovalQueue of sourceUser.vendoApprovalQueues) {
        await manager.update(
          OemVendoApprovalQueue,
          {
            vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
            isEnabled: true,
            isActive: true,
          },
          {
            userId: targetUserId,
          },
        );
      }

      // deactivate the source user
      await manager.update(
        OemUserEntity,
        {
          userId: id,
        },
        {
          isActive: false,
          isEnabled: false,
        },
      );
    });

    return targetUser;
  }

  //TODO: we might have creatingUser and ownerUser for different contexts
  async deleteOne(
    req: CrudRequest,
    dto?: OemUserDeleteDto,
  ): Promise<void | OemUserEntity> {
    return this.repo.manager.connection.transaction(async (manager) => {
      const replaceUserId = dto.replaceUserId;
      const relations = this.repo.metadata.ownRelations.map(
        (relation) => relation.inverseEntityMetadata,
      );
      // req.params we put manually of parsed is not found
      const userId =
        (req &&
          req.parsed &&
          req.parsed.paramsFilter &&
          req.parsed.paramsFilter.find(
            (params) => params.field === req.options.params.id.field,
          ).value) ||
        req['params']['id'];
      //disable current user
      await this.repo.update(
        {
          userId: userId,
          isEnabled: true,
        },
        {
          isEnabled: false,
        },
      );

      for (const relation of relations) {
        //update only ownerUserId and userId
        const updatedFields = Object.keys(relation.propertiesMap).filter(
          (item) => ['userId', 'ownerUserId'].includes(item),
        );

        /*SET FOREIGN_KEY_CHECKS=0;
        SET;FOREIGN_KEY_CHECKS = 1 */
        for (const updatedField of updatedFields) {
          const repo = await manager.getRepository(relation.targetName);

          //this is a danger zone, so we set LOCAL
          await repo.query(`SET LOCAL session_replication_role = 'replica';`);

          await manager.update(
            relation.targetName,
            {
              [updatedField]: userId,
            },
            {
              [updatedField]: replaceUserId,
            },
          );

          //this is a danger zone, so we disable LOCALly
          await repo.query(`SET LOCAL session_replication_role = 'origin';`);
        }
      }
    });
  }

  /**
   * Checks if request owner is not admin, then throws error.
   * Re-assigns all users roles from given `sourceRoleId` to `targetRoleId`.
   */
  async bulkReassignRoles(
    req: CrudRequest & { user: OemUserEntity },
    body: OemUserRoleReassignDto,
  ) {
    const isAdmin = req.user.role.roleType == RoleTypeEnum.ADMIN;
    const { sourceRoleId, targetRoleId } = body;

    if (!isAdmin) {
      throw new BadRequestException('Access restricted for current user.');
    }

    return this.repo.update(
      {
        roleId: sourceRoleId,
      },
      {
        roleId: targetRoleId,
      },
    );
  }
}
