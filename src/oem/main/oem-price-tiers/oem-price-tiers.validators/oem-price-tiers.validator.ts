import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { OemPriceTierEntity } from '../oem-price-tier.entity';

@ValidatorConstraint({ name: 'isPriceTierAlreadyExist', async: true })
@Injectable()
export class IsPriceTierAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemPriceTierEntity)
    private readonly repo: Repository<OemPriceTierEntity>,
  ) {}

  async validate(productId: number, args: any): Promise<boolean> {
    const priceTier = await this.repo.findOne({ productId: productId });

    return !priceTier;
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}

/*@ValidatorConstraint({ name: 'isPhoneAlreadyExist', async: true })
@Injectable()
export class IsPhoneAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemUserEntity)
    private readonly repo: Repository<OemUserEntity>,
  ) {}

  async validate(phone: string): Promise<boolean> {
    const user = await this.repo.findOne({ phone: phone });

    return !user;
  }

  defaultMessage(): string {
    return 'The phone «$value» is already register.';
  }
}
*/
