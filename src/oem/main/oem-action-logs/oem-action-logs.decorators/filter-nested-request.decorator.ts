import { InjectRepository } from '@nestjs/typeorm';
import { OemActionLogEntity } from '../oem-action-log.entity';

export function FilterNestedRequest(
  nestedFields: Array<string>,
  bubble = true,
) {
  const injectActionLogRepo = InjectRepository(OemActionLogEntity);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectActionLogRepo(target, 'repoActionLog');
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      try {
        const req = args[0];
        const { parsed, options } = req;
        const filters = req.parsed.filter;
        const builder = await this.createBuilder(parsed, options);
        //we can use this implementation to be able get multiple nested fields in depth (but for now we don't need it)
        for (const filter of filters) {
          const mandatoryField = filter.field.split('.')[0];
          const secondaryField = filter.field.split('.')[1];
          if (
            secondaryField == null ||
            nestedFields.indexOf(mandatoryField) == -1
          ) {
            continue;
          }

          builder.where(
            `${mandatoryField}->>'${secondaryField}' = :${secondaryField}`,
            { [secondaryField]: filter.value },
          );
        }
        return this.doGetMany(builder, parsed, options);
      } catch (error) {
        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
