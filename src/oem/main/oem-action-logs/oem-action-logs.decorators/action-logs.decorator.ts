//import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OemActionLogEntity } from '../oem-action-log.entity';
import { Repository } from 'typeorm';
import { ActionLogTypeEnum } from '../oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-log.enums/actions.enum';
import { TenantsService } from '../../../../shared/tenants/tenants.service';
import { Inject } from '@nestjs/common';
import { OemQuoteEntity } from '../../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../oem-vendos/oem-vendo.entity';
import { OemShadingRule } from '../../oem-rules/oem-shading-rules/oem-shading-rule.entity';
import { OemWorkflowRule } from '../../oem-rules/oem-workflow-rules/oem-workflow-rule.entity';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { OemCompanyEntity } from '../../oem-companies/oem-company.entity';
import { OemDiscountEntity } from '../../oem-discounts/oem-discount.entity';
import { OemDiscountRuleEntity } from '../../oem-rules/oem-discount-rules/oem-discount-rule.entity';
import { OemProductsRelationships } from '../../../intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import { OemPricingModelEntity } from '../../oem-pricing-models/oem-pricing-model.entity';
import * as _ from 'lodash';
import { OemRoleEntity } from '../../oem-roles/oem-role.entity';
import { OemMaterialEntity } from '../../oem-materials/oem-material.entity';
import { OemAddressEntity } from '../../oem-addresses/oem-address.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';

const getContext = (_type: ActionLogTypeEnum) => {
  switch (_type) {
    case ActionLogTypeEnum.QUOTE:
      return {
        context: 'quote',
        entity: OemQuoteEntity,
      };
    case ActionLogTypeEnum.VENDO:
      return {
        context: 'vendo',
        entity: OemVendoEntity,
      };
    case ActionLogTypeEnum.ROLE:
      return {
        context: 'role',
        entity: OemRoleEntity,
      };
    case ActionLogTypeEnum.DISCOUNT:
      return {
        context: 'discount',
        entity: OemDiscountEntity,
      };
    case ActionLogTypeEnum.USER:
      return {
        context: 'user',
        entity: OemUserEntity,
      };
    case ActionLogTypeEnum.SHADING_RULES:
      return {
        context: 'shadingRule',
        entity: OemShadingRule,
      };
    case ActionLogTypeEnum.WORKFLOW_RULES:
      return {
        context: 'workflowRule',
        entity: OemWorkflowRule,
      };
    case ActionLogTypeEnum.COMPANY_CHANNELS:
      return {
        context: 'companyChannel',
        entity: OemCompanyChannel,
      };
    case ActionLogTypeEnum.COMPANY:
      return {
        context: 'company',
        entity: OemCompanyEntity,
      };
    case ActionLogTypeEnum.MATERIAL:
      return {
        context: 'material',
        entity: OemMaterialEntity,
      };
    case ActionLogTypeEnum.ADDRESS:
      return {
        context: 'addresss',
        entity: OemAddressEntity,
      };
    case ActionLogTypeEnum.DISCOUNT_RULES:
      return {
        context: 'discountRule',
        entity: OemDiscountRuleEntity,
      };
    case ActionLogTypeEnum.PRODUCT_RELATIONSHIPS:
      return {
        context: 'productRelationship',
        entity: OemProductsRelationships,
      };
    case ActionLogTypeEnum.PRICING_RULES:
      return {
        context: 'pricingModel',
        entity: OemPricingModelEntity,
      };
  }
};

export function ActionLogs(
  type: ActionLogTypeEnum,
  action: ActionsEnum,
  bubble = true,
) {
  const injectActionLogRepo = InjectRepository(OemActionLogEntity);
  const injectTenantsService = Inject(TenantsService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectActionLogRepo(target, 'repoActionLog');
    injectTenantsService(target, 'tenantsService');
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      try {
        const repoActionLog: Repository<OemActionLogEntity> =
          this.repoActionLog;
        const { user } = args[0];

        let association = {};
        const repo =
          this.repo ||
          repoActionLog.manager.getRepository(getContext(type).entity);
        let oldRes;
        if ([ActionsEnum.UPDATE, ActionsEnum.DELETE].indexOf(action) !== -1) {
          const req = args[0];
          /*//console.log(req, req.parsed.paramsFilter, req.options.params)
          const params = req.parsed.paramsFilter;
          let searchCondition = {};
          for (const param of params) {
            searchCondition = {
              ...searchCondition,
              [req.options.params[param].field]: req.options.params[param].value,
            };
          }*/
          oldRes = await this.getOne({
            ...req,
          });
        }
        //bc if we call deleteOne - it returns undefined by default, so to be able keep association we redefine by oldRes;
        const res = (await originalMethod.apply(this, args)) || oldRes || {};

        //instead of getting all fields, we are getting only which need be observed from all tracked entities
        const collectTrackedFields = (
          disallowedTrackedFields?: Array<string>,
        ) => {
          const trackedEntities = Object.keys(ActionLogTypeEnum).map(
            (value) => getContext(ActionLogTypeEnum[value]).entity,
          );

          //we should add a constructor name if method return exemplar from class which we do not attach previously
          trackedEntities.push(res.constructor.name);
          //if context is different then parent repo
          trackedEntities.push(repo.metadata.targetName);
          const trackedFields = {};
          for (const entity of trackedEntities) {
            try {
              repoActionLog.manager
                .getRepository(entity)
                .metadata.ownColumns.map(
                  (columnMetadata) => columnMetadata.propertyName,
                )
                .forEach((field) => {
                  if (
                    disallowedTrackedFields &&
                    disallowedTrackedFields.indexOf(field) == -1
                  )
                    trackedFields[field] = null;
                });
            } catch (e) {
              continue;
            }
          }
          return Object.keys(trackedFields);
        };

        const allowedTrackedFields = collectTrackedFields([
          'isEnabled',
          'createdAt',
          'updatedAt',
          'password',
        ]);
        const filteredRes = Object.keys(res)
          .filter((key) => allowedTrackedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = res[key];
            return obj;
          }, {});

        if (oldRes) {
          const primaryKeys = repo.metadata.ownColumns
            .filter((value) => value.isPrimary === true)
            .map((value) => value.propertyName);
          for (const i in repo.metadata.propertiesMap) {
            if (
              !_.isEqual(oldRes[i], filteredRes[i]) ||
              primaryKeys.indexOf(i) !== -1
            ) {
              association[i] = filteredRes[i];
            }
          }
        } else association = { ...filteredRes };

        const log = {
          companyId: user && user.companyId /* || res.user.companyId*/,
          type: type,
          association: Object.keys(association).reduce((acc, key) => {
            const _acc = acc;
            if (association[key] !== undefined) _acc[key] = association[key];
            return _acc;
          }, {}),
          subject: {
            userId:
              (user && user.userId) || 'system' /*|| res.userId || 'system'*/,
          },
          action: action,
        };

        await repoActionLog.save(this.repoActionLog.create(log));

        return res;
      } catch (error) {
        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
