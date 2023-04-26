import { ExecutionContext, Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, createAliasResolver, ExtractSubjectType } from '@casl/ability';
import { getAction, getFeature } from '@nestjsx/crud';
import { Request } from 'express';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { RoleAbility } from './types/role-ability.type';
import { RoleActions } from './types/role-actions.enum';
import { RoleSubjects } from './types/role-subjects.type';

import { OemUserEntity } from '../../oem/main/oem-users/oem-user.entity';
import { OemQuoteEntity } from '../../oem/main/oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../oem/main/oem-vendos/oem-vendo.entity';

import { CreateAccessEnum } from '../../oem/main/oem-roles/oem-role.enums/create-access.enum';
import { DataAccessEnum } from '../../oem/main/oem-roles/oem-role.enums/data-access.enum';
import { RoleTypeEnum } from '../../oem/main/oem-roles/oem-role.enums/role-type.enum';
import { ToTypeEnum } from '../../oem/main/oem-quotes/oem-quote.enums/to.enum';
import { QuoteStatusEnum } from '../../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';
import { VendoStatusEnum } from '../../oem/main/oem-vendos/oem-vendo.enums/vendo-status.enum';

@Injectable()
export class RoleAbilityFactory {
  constructor(
    //TODO: we should avoid it use master connection, bc everything should be company scoped
    @InjectConnection('MASTER_CONNECTION')
    private readonly connection: Connection,
  ) {}

  private _getRoleAction(context: ExecutionContext) {
    const handler = context.getHandler();
    return getAction(handler) as RoleActions;
  }

  private _getRoleSubject(context: ExecutionContext) {
    const controller = context.getClass();
    return getFeature(controller) as RoleSubjects;
  }

  private _defineDataAccess(
    abilityBuilder: AbilityBuilder<Ability<[RoleActions, RoleSubjects]>>,
    dataAccess: DataAccessEnum,
  ) {
    // TODO: take into account for GET /quotes/:quoteId, GET /vendos/:vendoId, GET /recently-viewed-quotes-vendos
    switch (dataAccess) {
      case DataAccessEnum.ALL:
        break;
      case DataAccessEnum.TEAM_SUB_HIERARCHY:
        break;
      case DataAccessEnum.TEAM_ONLY:
        break;
      case DataAccessEnum.ASSIGNED_ONLY:
        break;
      default:
        break;
    }
  }

  private _defineRoleType(
    abilityBuilder: AbilityBuilder<Ability<[RoleActions, RoleSubjects]>>,
    roleType: RoleTypeEnum,
  ) {
    // TODO: take into account for POST, PATCH, PUT & DELETE /workflow-rules and /vacation-rules
    switch (roleType) {
      case RoleTypeEnum.ADMIN:
        break;
      case RoleTypeEnum.QUOTE_CREATOR:
        break;
      case RoleTypeEnum.WORKFLOW_APPROVER:
        break;
      case RoleTypeEnum.CHANNEL_MANAGER:
        break;
      default:
        break;
    }
  }

  private _defineCreateAccess(
    abilityBuilder: AbilityBuilder<Ability<[RoleActions, RoleSubjects]>>,
    createAccess: CreateAccessEnum,
    req: Request,
  ) {
    const { cannot } = abilityBuilder;

    switch (createAccess) {
      case CreateAccessEnum.ALL:
        break;
      case CreateAccessEnum.INTERNAL_CREATE:
        if (req?.query?.to === ToTypeEnum.EXTERNAL) {
          cannot(RoleActions.Submit, RoleSubjects.Quote);
          cannot(RoleActions.Submit, RoleSubjects.Vendo);
        }
        cannot(RoleActions.Modify, RoleSubjects.QuoteApprovalQueue);
        cannot(RoleActions.Modify, RoleSubjects.VendoApprovalQueue);
        break;
      case CreateAccessEnum.EDIT_APPROVE_ONLY:
        cannot(RoleActions.Create, RoleSubjects.Quote);
        cannot(RoleActions.Create, RoleSubjects.Vendo);
        cannot(RoleActions.Submit, RoleSubjects.Quote);
        cannot(RoleActions.Submit, RoleSubjects.Vendo);
        break;
      case CreateAccessEnum.VIEW_ONLY:
        cannot(RoleActions.Modify, RoleSubjects.Quote);
        cannot(RoleActions.Modify, RoleSubjects.Vendo);
        break;
      default:
        break;
    }
  }

  private async _defineDeleteAccess(
    abilityBuilder: AbilityBuilder<Ability<[RoleActions, RoleSubjects]>>,
    context?: ExecutionContext,
  ) {
    if (!context) {
      return;
    }

    const { cannot } = abilityBuilder;
    const req = context?.switchToHttp().getRequest() as Request;
    const action = this._getRoleAction(context);
    const subject = this._getRoleSubject(context);

    if (action === RoleActions.DeleteOne && subject === RoleSubjects.Quote) {
      const quoteId = req.params.id;
      const quote = await this.connection.manager.findOne(
        OemQuoteEntity,
        quoteId,
      );
      if (quote.quoteStatus === QuoteStatusEnum.TRANSACTED) {
        cannot(action, subject);
      }
    } else if (
      action === RoleActions.DeleteOne &&
      subject === RoleSubjects.Vendo
    ) {
      const vendoId = req.params.id;
      const vendo = await this.connection.manager.findOne(
        OemVendoEntity,
        vendoId,
      );
      if (vendo.vendoStatus === VendoStatusEnum.TRANSACTED) {
        cannot(action, subject);
      }
    }
  }

  async createForUser(user: OemUserEntity, context?: ExecutionContext) {
    const abilityBuilder = new AbilityBuilder<
      Ability<[RoleActions, RoleSubjects]>
    >(Ability as AbilityClass<RoleAbility>);
    const { can, build } = abilityBuilder;

    if (user) {
      can(RoleActions.Manage, RoleSubjects.All); // read-write access to everything by default
    }

    // console.log('RoleAbilityFactory user', user);
    // https://bloodandtreasure.atlassian.net/browse/VEN-883
    if (user?.role) {
      // console.log('RoleAbilityFactory => user.role', user.role);
      const req = context?.switchToHttp().getRequest() as Request;

      this._defineDataAccess(abilityBuilder, user.role.dataAccess);
      this._defineRoleType(abilityBuilder, user.role.roleType);
      this._defineCreateAccess(abilityBuilder, user.role.createAccess, req);
      await this._defineDeleteAccess(abilityBuilder, context);
    }

    const resolveAction = createAliasResolver({
      [RoleActions.Read]: [RoleActions.ReadOne, RoleActions.ReadAll],
      [RoleActions.Create]: [
        RoleActions.CreateOne,
        RoleActions.CreateMany,
        RoleActions.Clone,
        RoleActions.CloneBulk,
      ],
      [RoleActions.Modify]: [
        RoleActions.CreateOne,
        RoleActions.CreateMany,
        RoleActions.UpdateOne,
        RoleActions.ReplaceOne,
        RoleActions.DeleteOne,
        RoleActions.Submit,
        RoleActions.Clone,
        RoleActions.DeleteBulk,
      ],
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item as ExtractSubjectType<RoleSubjects>,
      resolveAction,
    });
  }

  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const ability = await this.createForUser(user, context);

    const action = this._getRoleAction(context);
    const subject = this._getRoleSubject(context);

    const can = ability.can(action, subject);
    // console.log(`RoleAbilityFactory => ${can ? 'Can' : 'Cannot'} ${action} ${subject}`);

    return can;
  }
}
