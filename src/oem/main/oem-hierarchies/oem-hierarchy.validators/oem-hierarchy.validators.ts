import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { OemHierarchyEntity } from '../oem-hierarchy.entity';
import { HierarchyTypeEnum } from '../../oem-hierarchy-levels/oem-hierarchy-level.enums/hierarchy-type.enum';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'isProductHierarchy', async: true })
@Injectable()
@SetCurrentTenant
export class IsProductHierarchy implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemHierarchyEntity)
    private readonly repo: Repository<OemHierarchyEntity>,
  ) {}

  async validate(hierarchyId: number): Promise<boolean> {
    const hierarchy = await this.repo.findOne({
      where: {
        hierarchyId: hierarchyId,
      },
      relations: ['hierarchyLevel'],
    });

    return (
      hierarchy.hierarchyLevel.hierarchyType === HierarchyTypeEnum.PRODUCT_LEVEL
    );
  }

  defaultMessage(): string {
    return 'The hierarchy does not rely to a product hierarchy';
  }
}

@ValidatorConstraint({ name: 'isGeoHierarchy', async: true })
@Injectable()
@SetCurrentTenant
export class IsGeoHierarchy implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemHierarchyEntity)
    private readonly repo: Repository<OemHierarchyEntity>,
  ) {}

  async validate(hierarchyId: number): Promise<boolean> {
    const hierarchy = await this.repo.findOne({
      where: {
        hierarchyId: hierarchyId,
      },
      relations: ['hierarchyLevel'],
    });

    return (
      hierarchy.hierarchyLevel.hierarchyType ===
      HierarchyTypeEnum.USER_GEOGRAPHY
    );
  }

  defaultMessage(): string {
    return 'The hierarchy does not rely to a geo hierarchy';
  }
}
