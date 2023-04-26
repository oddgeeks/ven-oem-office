import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { OemQuoteAndVendoUuid } from '../oem-quote-and-vendo-uuid.entity';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';
import { QuoteAndVendoUuidDto } from '../oem-quote-and-vendo-uuid.dto/oem-quote-and-vendo-uuid.dto';

@ValidatorConstraint({
  name: 'QuoteAndVendoUuuidLastUuidValidator',
  async: true,
})
@Injectable()
@SetCurrentTenant
export class QuoteAndVendoLastUuidValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(OemQuoteAndVendoUuid)
    private readonly repo: Repository<OemQuoteAndVendoUuid>,
  ) {}

  async validate(
    lastUuid: number,
    args?: ValidationArguments,
  ): Promise<boolean> {
    try {
      const { quoteAndVendoUuidType } = args.object as QuoteAndVendoUuidDto;
      const quoteAndVendoUuid = await this.repo.findOne({
        where: {
          quoteAndVendoUuidType,
          isEnabled: true,
        },
      });

      return !quoteAndVendoUuid || lastUuid >= quoteAndVendoUuid.lastUuid;
    } catch (err) {
      throw new BadRequestException('Cannot validate quote and vendo uuid');
    }
  }
}

export function QuoteAndVendoUuuidLastUuidValidator(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions || {
        message:
          'Starting number should be greater or equal to the current sequence',
      },
      validator: QuoteAndVendoLastUuidValidatorConstraint,
    });
  };
}
