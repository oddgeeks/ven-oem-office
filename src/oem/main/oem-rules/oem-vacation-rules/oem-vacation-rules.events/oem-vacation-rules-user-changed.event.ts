export class OemVacationRulesUserChangedEvent {
  vacationRuleId: number;

  constructor(payload: { vacationRuleId: number }) {
    this.vacationRuleId = payload.vacationRuleId;
  }
}
