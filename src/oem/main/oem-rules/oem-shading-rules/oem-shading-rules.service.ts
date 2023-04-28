import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Connection, Repository, EntityManager } from 'typeorm';

import { OemShadingRule } from './oem-shading-rule.entity';
import { OemShadingRuleUpdateDto } from './oem-shading-rule.dto/oem-shading-rule.update.dto';
import { OemShadingRuleReplaceDto } from './oem-shading-rule.dto/oem-shading-rule.replace.dto';
import { ActionLogs } from '../../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../../common/decorators/set-clone-method.decorator';
import { OemShadingRulePriorityDto } from './oem-shading-rule.dto/oem-shading-rule.priority.dto';
import { getIdCrudParsed } from '../../../../utils/get-id-crud-parsed.util';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod()
export class OemShadingRulesService extends TypeOrmCrudService<OemShadingRule> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemShadingRule) public repo: Repository<OemShadingRule>,
  ) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.SHADING_RULES, ActionsEnum.UPDATE)
  async replacePriority(req: CrudRequest, dto: OemShadingRulePriorityDto) {
    const shadingRuleId = getIdCrudParsed(req).value;
    const replacePriorityInstance = await this.repo.findOne({
      priority: dto.priority,
    });
    const currentPriorityInstance = await this.repo.findOne({
      shadingRuleId
    });
    if (!replacePriorityInstance) {
      throw new NotFoundException('Shading-rule with such priority not found');
    }
    if (currentPriorityInstance) {
      await this.repo.update(replacePriorityInstance.shadingRuleId, {
        priority: currentPriorityInstance.priority,
      });
    }
    await this.repo.update(shadingRuleId, {
      priority: dto.priority,
    });

    const entity = await this.repo.findOne({ shadingRuleId });
    if (!entity) {
      throw new NotFoundException('Shading-rule not found');
    }
    return entity;
  }

  //TODO: shadingRuleId should come from dto!!!!, also req should be appliyed for update operations (filters and so on)
  async update(
    // req,
    shadingRuleId: number,
    dto: Partial<OemShadingRuleUpdateDto>,
    manager: EntityManager,
  ) {
    //TODO: should be a seperated method which do it, see discount.decorator -> SetRetroactively()
    const shadingRule = await this.repo.findOne(shadingRuleId);
    if (!shadingRule) {
      throw new NotFoundException('Shading rule not found');
    }

    const { companyId, priority: originalPriority } = shadingRule;
    const newPriority = dto.priority;

    if (newPriority && originalPriority !== newPriority) {
      // retroactive update for other priorities
      // ┌─────┬─────────────────────┬──────────┬───────────────┬─────────────────────┐
      // │  #  │      Original       │  Action  │ isDecreasing  |       Result        │
      // ├─────┼─────────────────────┼──────────┼───────────────┼─────────────────────┤
      // │  1  │    1, 2, 3, 4, 5    │  4 -> 2  │     true      |    1, 3, 4, 2, 5    │
      // ├─────┼─────────────────────┼──────────┼───────────────┼─────────────────────┤
      // │  2  │    1, 3, 4, 2, 5    │  2 -> 4  │     false     |    1, 2, 3, 4, 5    │
      // ├─────┼─────────────────────┼──────────┼───────────────┼─────────────────────┤
      // │  3  │    1, 2, 3, 4, 5    │  5 -> 6  │     false     |    1, 2, 3, 4, 6    │
      // └─────┴─────────────────────┴──────────┴───────────────┴─────────────────────┘

      const isDecreasing = newPriority < originalPriority;
      const where = isDecreasing
        ? 'companyId = :companyId AND priority >= :newPriority AND priority < :originalPriority'
        : 'companyId = :companyId AND priority > :originalPriority AND priority <= :newPriority';
      const set = isDecreasing ? 'priority + 1' : 'priority - 1';

      await manager
        .createQueryBuilder()
        .update(OemShadingRule)
        .set({
          priority: () => set,
        })
        .where(where, { companyId, originalPriority, newPriority })
        .execute();
    }

    return manager.save(
      this.repo.create({
        ...shadingRule,
        ...dto,
      }),
    );
  }

  @ActionLogs(ActionLogTypeEnum.SHADING_RULES, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemShadingRuleUpdateDto>,
  ): Promise<OemShadingRule> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      return this.update(id.value, dto, manager); // req,
    });
  }

  @ActionLogs(ActionLogTypeEnum.SHADING_RULES, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemShadingRuleReplaceDto>,
  ): Promise<OemShadingRule> {
    return this.connection.transaction(async (manager) => {
      const shadingRuleId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const shadingRule = await this.repo.findOne(shadingRuleId.value);
      if (shadingRule) {
        return this.update(shadingRuleId.value, dto, manager);
      }

      return super.replaceOne(req, dto);
    });
  }
  @ActionLogs(ActionLogTypeEnum.SHADING_RULES, ActionsEnum.DELETE)
  async deleteOne(req: CrudRequest): Promise<void | OemShadingRule> {
    const shadingRuleId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );

    const shadingRule = await this.repo.findOne(shadingRuleId.value);
    if (!shadingRule) {
      throw new NotFoundException('Shading rule not found');
    }

    // retroactive update for other priorities
    // ┌─────┬─────────────────────┬────────────────────┬───────────────┐
    // │  #  │      Original       │  Deleted Priority  │     Result    │
    // ├─────┼─────────────────────┼────────────────────┼───────────────┤
    // │  1  │    1, 2, 3, 4, 5    │          1         │   1, 2, 3, 4  │
    // ├─────┼─────────────────────┼────────────────────┼───────────────┤
    // │  2  │    1, 2, 3, 4       │          2         │     1, 2, 3   │
    // ├─────┼─────────────────────┼────────────────────┼───────────────┤
    // │  3  │       1, 2, 3       │          3         │      1, 2     │
    // └─────┴─────────────────────┴────────────────────┴───────────────┘

    const { companyId, priority } = shadingRule;

    await this.repo.manager
      .createQueryBuilder()
      .update(OemShadingRule)
      .set({
        priority: () => 'priority - 1',
      })
      .where('companyId = :companyId AND priority > :priority', {
        companyId,
        priority,
      })
      .execute();

    return super.deleteOne(req);
  }
}
