import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { OemVacationRule } from './oem-vacation-rule.entity';
import { OemVacationRuleEventsEnum } from './oem-vacation-rule.enums/oem-vacation-rule.events.enum';
import { OemVacationRulesUserChangedEvent } from './oem-vacation-rules.events/oem-vacation-rules-user-changed.event';

@EventSubscriber()
export class OemVacationRulesSubscriber
  implements EntitySubscriberInterface<OemVacationRule>
{
  constructor(connection: Connection, private eventEmitter: EventEmitter2) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return OemVacationRule;
  }

  afterInsert(event: InsertEvent<OemVacationRule>) {
    this.eventEmitter.emit(
      OemVacationRuleEventsEnum.USER_CHANGED,
      new OemVacationRulesUserChangedEvent({
        vacationRuleId: event.entity.vacationRuleId,
      }),
    );
  }

  afterUpdate(event: UpdateEvent<OemVacationRule>) {
    const isSourceOrTargetUserChanged =
      event.updatedColumns.filter((column) => {
        const oldValue = event.databaseEntity[column.propertyName];
        const newValue = event.entity[column.propertyName];

        return (
          ['source_user_id', 'target_user_id'].includes(column.propertyName) &&
          oldValue !== newValue
        );
      }).length > 0;

    if (isSourceOrTargetUserChanged) {
      this.eventEmitter.emit(
        OemVacationRuleEventsEnum.USER_CHANGED,
        new OemVacationRulesUserChangedEvent({
          vacationRuleId: event.entity.vacationRuleId,
        }),
      );
    }
  }
}
