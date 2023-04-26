import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { OemMaterialEntity } from '../../../main/oem-materials/oem-material.entity';
import { ApplicableToEnum } from '../../../main/oem-materials/oem-material.enums/applicable-to.enum';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'isMaterialInapplicable', async: true })
@Injectable()
@SetCurrentTenant
export class IsMaterialInapplicable implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemMaterialEntity)
    private readonly repo: Repository<OemMaterialEntity>,
  ) {}

  async validate(materialId: number): Promise<boolean> {
    const material = await this.repo.findOne({ materialId: materialId });
    return !(material.applicableTo === ApplicableToEnum.VENDO);
  }

  defaultMessage(): string {
    return 'The material is not applicable to Quote.';
  }
}
