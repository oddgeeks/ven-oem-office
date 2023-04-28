import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OemDiscountEntity } from '../oem-discount.entity';
import { In, Repository } from 'typeorm';
import { UnprocessableEntityException } from '@nestjs/common';

export function RetroactivelyPriority(bubble = true) {
  const injectDiscountRepo = InjectRepository(OemDiscountEntity);
  const injectConnection = InjectDataSource();

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectDiscountRepo(target, 'repo');
    injectConnection(target, 'connection');

    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      try {
        const repo: Repository<OemDiscountEntity> = this.repo;
        const { sourceDiscountId, targetDiscountId } = args[1];

        const discounts = await repo.find({
          where: {
            discountId: In([sourceDiscountId, targetDiscountId]),
          },
        });

        const sourceDiscount = discounts.find(
          (discount) => discount.discountId == sourceDiscountId,
        );
        const targetDiscount = discounts.find(
          (discount) => discount.discountId == targetDiscountId,
        );

        if (sourceDiscount && targetDiscount) {
          if (sourceDiscount.applicableTo !== targetDiscount.applicableTo) {
            throw new UnprocessableEntityException(
              'Discounts priorities are from different sections.',
            );
          }

          await this.repo
            .createQueryBuilder()
            .update({
              priority: targetDiscount.priority,
            })
            .where({
              discountId: sourceDiscount.discountId,
            })
            .returning('*')
            .execute();

          await this.repo
            .createQueryBuilder()
            .update({
              priority: sourceDiscount.priority,
            })
            .where({
              discountId: targetDiscount.discountId,
            })
            .returning('*')
            .execute();

          return await originalMethod.apply(this, args);
        }

        throw new UnprocessableEntityException('Values are out of the range.');
      } catch (error) {
        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
