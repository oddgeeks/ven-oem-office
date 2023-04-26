import { AntecedentType } from './antecedent.type';
import { ConsequentType } from './consequent.type';

export class WorkflowRuleLogicType {
  antecedent: Array<AntecedentType>[10];
  consequent: Array<ConsequentType>[10];
}
