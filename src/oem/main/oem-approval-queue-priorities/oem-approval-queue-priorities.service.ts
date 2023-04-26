import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, EntityManager, Connection } from 'typeorm';

import { OemApprovalQueuePriority } from './oem-approval-queue-priority.entity';
import { OemApprovalQueuePriorityUpdateDto } from './oem-approval-queue-priority.dto/oem-approval-queue-priority.update.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemApprovalQeuePrioritiesService extends TypeOrmCrudService<OemApprovalQueuePriority> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemApprovalQueuePriority)
    public repo: Repository<OemApprovalQueuePriority>,
  ) {
    super(repo);
  }

  async create(dto: Partial<OemApprovalQueuePriority>, manager: EntityManager) {
    return manager.save(
      this.repo.create({
        companyId: dto.companyId,
        roleId: dto.roleId,
      }),
    );
  }

  async update(
    approvalQueuePriorityId: number,
    dto: Partial<OemApprovalQueuePriority>, //we should have an ability to update service flags
    manager: EntityManager,
  ) {
    const approvalQueuePriority = await this.repo.findOne(
      approvalQueuePriorityId,
    );
    if (!approvalQueuePriority) {
      throw new NotFoundException('Approval Queue Priority not found');
    }

    const originalPriority = approvalQueuePriority.priority;
    const newPriority = dto.priority;

    if (originalPriority !== newPriority) {
      // retroactive update for other priorities
      // ┌─────┬───────────────┬──────────┬───────────────┬───────────────┐
      // │  #  │   Original    │  Action  │ isDecreasing  |    Result     │
      // ├─────┼───────────────┼──────────┼───────────────┼───────────────┤
      // │  1  │ 1, 2, 3, 4, 5 │  4 -> 2  │     true      | 1, 3, 4, 2, 5 │
      // ├─────┼───────────────┼──────────┼───────────────┼───────────────┤
      // │  2  │ 1, 3, 4, 2, 5 │  2 -> 4  │     false     | 1, 2, 3, 4, 5 │
      // ├─────┼───────────────┼──────────┼───────────────┼───────────────┤
      // │  3  │ 1, 2, 3, 4, 5 │  5 -> 6  │     false     | 1, 2, 3, 4, 6 │
      // └─────┴───────────────┴──────────┴───────────────┴───────────────┘

      const isDecreasing = newPriority < originalPriority;
      const where = isDecreasing
        ? 'priority >= :newPriority AND priority < :originalPriority'
        : 'priority > :originalPriority AND priority <= :newPriority';
      const set = isDecreasing ? 'priority + 1' : 'priority - 1';

      await manager
        .createQueryBuilder()
        .update(OemApprovalQueuePriority)
        .set({
          priority: () => set,
        })
        .where(where, { originalPriority, newPriority })
        .execute();
    }

    return manager.save(
      this.repo.create({
        ...approvalQueuePriority,
        ...dto,
      }),
    );
  }

  async updateOne(
    req: CrudRequest,
    dto: Partial<OemApprovalQueuePriorityUpdateDto>,
  ): Promise<OemApprovalQueuePriority> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      return this.update(id.value, dto, manager);
    });
  }
}
