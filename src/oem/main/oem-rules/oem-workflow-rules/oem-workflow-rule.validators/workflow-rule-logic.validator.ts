import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { WorkflowRuleLogicType } from '../oem-workflow-rule.type/workflow-rule-logic.type';
import { AntecedentType } from '../oem-workflow-rule.type/antecedent.type';
import { QuantifiersEnum } from '../oem-workflow-rule.enums/quantifiers.enum';
import { PredicatesEnum } from '../oem-workflow-rule.enums/predicates.enum';
import { WorkflowRuleLogicConditionConfigType } from '../oem-workflow-rule.type/workflow-rule-logic-conditions-config.type';
import { WorkflowRuleLogicConfigType } from '../oem-workflow-rule.type/workflow-rule-logic-config.type';
import { WorkflowRuleLogicConfig } from './workflow-rule-logic.validator.config';
import { InjectRepository } from '@nestjs/typeorm';
import { OemProductEntity } from '../../../oem-products/oem-product.entity';
import { In, Repository } from 'typeorm';
import { OemHierarchyEntity } from '../../../oem-hierarchies/oem-hierarchy.entity';
import { ConsequentType } from '../oem-workflow-rule.type/consequent.type';
import { OemUserEntity } from '../../../oem-users/oem-user.entity';

@ValidatorConstraint({ name: 'IsWorkflowRuleLogicValid', async: true })
@Injectable()
export class IsWorkflowRuleLogicValid implements ValidatorConstraintInterface {
  private message: string;

  constructor(
    @Inject('CONFIGS')
    private readonly configs: Array<WorkflowRuleLogicConfigType>,
    @InjectRepository(OemProductEntity)
    private readonly productsRepo: Repository<OemProductEntity>,
    @InjectRepository(OemHierarchyEntity)
    private readonly hierarchiesRepo: Repository<OemHierarchyEntity>,
    @InjectRepository(OemUserEntity)
    private readonly usersRepo: Repository<OemUserEntity>,
  ) {
    this.message = '';
  }

  async validate(rule: WorkflowRuleLogicType): Promise<boolean> {
    const res = await this.checkRule(rule, this.configs);
    if (res !== true) {
      this.message = res as string;
      return false;
    }
    return res;
  }

  defaultMessage(): string {
    return this.message;
  }

  async checkRule(
    rule: WorkflowRuleLogicType,
    configs: Array<WorkflowRuleLogicConfigType>,
  ): Promise<boolean | string> {
    const antecedents: Array<AntecedentType> = Array.from(
      rule.antecedent as unknown as Array<AntecedentType>,
    );
    const consequents: Array<ConsequentType> = Array.from(
      rule.consequent as unknown as Array<ConsequentType>,
    );
    return (
      (await this.checkLogic(antecedents, configs)) ||
      (await this.checkLogic(consequents, configs)) ||
      true
    );
  }

  async checkLogic(
    logics: Array<AntecedentType | ConsequentType>,
    configs: Array<WorkflowRuleLogicConfigType>,
  ): Promise<string> {
    for (let i = 0; i < logics.length; i++) {
      const logic = logics[i];
      const config = this.findConfig(
        logic.pre_quantifier as QuantifiersEnum,
        configs,
      );
      if (!config) {
        return `The pre_quantifier "${logic.pre_quantifier}" not found in workflow configuration`;
      }
      const condition = this.findCondition(
        logic.predicate as PredicatesEnum,
        config.conditions,
      );
      if (!condition) {
        return `The predicate "${logic.predicate}" not found for the pre_quantifier "${logic.pre_quantifier}"`;
      }
      if (
        Array.isArray(condition.post_quantifiers) &&
        Array.from(logic.post_quantifier).every((i) => typeof i === 'number') &&
        condition.post_quantifiers.indexOf(
          logic.post_quantifier as QuantifiersEnum,
        ) == -1
      ) {
        return `The post_quantifier "${logic.post_quantifier}" not found for the pre_quantifier "${logic.pre_quantifier}" with the predicate "${logic.predicate}"`;
      }

      //check productIds
      if (
        condition.post_quantifiers === QuantifiersEnum.THE_FOLLOWING_PRODUCTS
      ) {
        const products = await this.productsRepo.find({
          where: {
            productId: In(Array.from(logic.post_quantifier)),
          },
        });
        const missedIds = Array.from(logic.post_quantifier).filter(
          (el) =>
            !products.map((product) => product.productId).includes(Number(el)),
        );
        return `The such products ${missedIds} are not exist`;
      }

      //check hierarchyIds
      if (
        condition.post_quantifiers === QuantifiersEnum.THE_FOLLOWING_SALES_TEAM
      ) {
        const hierarchies = await this.hierarchiesRepo.find({
          where: {
            hierarchyId: In(Array.from(logic.post_quantifier)),
          },
        });
        const missedIds = Array.from(logic.post_quantifier).filter(
          (el) =>
            !hierarchies
              .map((product) => product.hierarchyId)
              .includes(Number(el)),
        );
        return `The such hierarchies ${missedIds} are not exist`;
      }

      //check usersIds
      if (condition.post_quantifiers === QuantifiersEnum.THE_FOLLOWING_USERS) {
        const users = await this.usersRepo.find({
          where: {
            userId: In(Array.from(logic.post_quantifier)),
          },
        });
        const missedIds = Array.from(logic.post_quantifier).filter(
          (el) => !users.map((product) => product.userId).includes(Number(el)),
        );
        return `The such users ${missedIds} are not exist`;
      }

      //check channelIds
      if (
        condition.post_quantifiers === QuantifiersEnum.THE_FOLLOWING_PARTNERS
      ) {
        const partners = []; /*await this.hierarchiesRepo.find({
            where: {
              hierarchyId: In(Array.from(logic.post_quantifier)),
            },
          });*/
        const missedIds = Array.from(logic.post_quantifier).filter(
          (el) =>
            !partners.map((product) => product.partnerId).includes(Number(el)),
        );
        return `The such partners ${missedIds} are not exist`;
      }

      // // raw text
      // if (condition.post_quantifiers === QuantifiersEnum.RAW_TEXT) {
      //   if (typeof logic.post_quantifier !== 'string')
      //     return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.RAW_TEXT}`;
      // }
      //date
      if (condition.post_quantifiers === QuantifiersEnum.DATE) {
        if (isNaN(Date.parse(logic.post_quantifier)))
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.DATE}`;
      }
      //days
      if (condition.post_quantifiers === QuantifiersEnum.DAYS) {
        if (
          typeof logic.post_quantifier !== 'number' &&
          +logic.post_quantifier >= 0
        )
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.DAYS}`;
      }

      //years
      if (condition.post_quantifiers === QuantifiersEnum.YEARS) {
        if (
          typeof logic.post_quantifier !== 'number' &&
          +logic.post_quantifier >= 0
        )
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.YEARS}`;
      }

      //dollars
      if (condition.post_quantifiers === QuantifiersEnum.DOLLARS) {
        if (
          typeof logic.post_quantifier !== 'number' &&
          +logic.post_quantifier >= 0
        )
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.DOLLARS}`;
      }

      //percents
      if (condition.post_quantifiers === QuantifiersEnum.PERCENT) {
        if (
          typeof logic.post_quantifier !== 'number' &&
          +logic.post_quantifier >= 0
        )
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.PERCENT}`;
      }

      //units
      if (condition.post_quantifiers === QuantifiersEnum.UNITS) {
        if (
          typeof logic.post_quantifier !== 'number' &&
          +logic.post_quantifier >= 0
        )
          return `The ${logic.post_quantifier} is not a ${QuantifiersEnum.PERCENT}`;
      }
    }
  }

  private findConfig(
    preQuantifier: QuantifiersEnum,
    configs: Array<WorkflowRuleLogicConfigType>,
  ): WorkflowRuleLogicConfigType {
    return configs.find(
      (config) =>
        config.pre_quantifiers
          .map((quantifier) => (quantifier || '').toLowerCase())
          .indexOf((preQuantifier || '').toString().toLowerCase()) !== -1,
    );
  }

  private findCondition(
    predicate: PredicatesEnum,
    conditions: Array<WorkflowRuleLogicConditionConfigType>,
  ): WorkflowRuleLogicConditionConfigType {
    return conditions.find(
      (condition) =>
        condition.predicates
          .map((predicate) => (predicate || '').toString().toLowerCase())
          .indexOf((predicate || '').toString().toLowerCase()) !== -1,
    );
  }
}
