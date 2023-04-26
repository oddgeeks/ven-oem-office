import { QuantifiersEnum } from '../oem-saved-alert-rule.enums/quantifiers.enum';
import { PredicatesEnum } from '../oem-saved-alert-rule.enums/predicates.enum';
import { SavedAlertRuleLogicConfigType } from '../oem-saved-alert-rule.type/saved-alert-rule-logic-config.type';

const QUANTIFIERS_PRODUCTS: Array<QuantifiersEnum> = [
  QuantifiersEnum.THE_FOLLOWING_PRODUCTS,
];
const QUANTIFIERS_TRANSACTIONS: Array<QuantifiersEnum> = [
  QuantifiersEnum.THE_FOLLOWING_TRANSACTION_ATTRIBUTES,
];
const QUANTIFIERS_VALUES_DOLLARS: Array<QuantifiersEnum> = [
  QuantifiersEnum.A_GROSS_MARGIN,
  QuantifiersEnum.A_RELATIVE_VALUE,
  QuantifiersEnum.A_NET_VALUE,
];

const QUANTIFIERS_VALUES_PERCENTS: Array<QuantifiersEnum> = [
  QuantifiersEnum.A_GROSS_MARGIN_PERCENT,
  QuantifiersEnum.A_RELATIVE_VALUE_PERCENT,
  QuantifiersEnum.TOTAL_CHANNEL_INCENTIVES,
];

const QUANTIFIERS_BILLING: Array<QuantifiersEnum> = [
  QuantifiersEnum.A_BILLING_PAYMENT_STRUCTURE,
  QuantifiersEnum.LAST_PRICE_PAID,
];

const QUANTIFIERS_UNIT: Array<QuantifiersEnum> = [
  QuantifiersEnum.A_QUANTITY_UNITS,
];

const QUANTIFIERS_TERMS: Array<QuantifiersEnum> = [
  QuantifiersEnum.A_TERM_LENGTH,
];

const QUANTIFIERS_SOLD: Array<QuantifiersEnum> = [
  QuantifiersEnum.THE_FOLLOWING_SALES_TEAM,
  QuantifiersEnum.THE_FOLLOWING_PARTNERS,
];

const QUANTIFIERS_TEXT: Array<QuantifiersEnum> = [
  QuantifiersEnum.EXTERNAL_COMMENTS_FIELD,
  QuantifiersEnum.INTERNAL_COMMENTS_FIELD,
];

const QUANTIFIERS_DEAL: Array<QuantifiersEnum> = [
  QuantifiersEnum.NET_NEW,
  QuantifiersEnum.EXPANSION,
  QuantifiersEnum.EXTENSION_RENEWAL,
  QuantifiersEnum.UPGRADE,
  QuantifiersEnum.DOWNGRADE,
];
const QUANTIFIERS_TRANSITIONS = [
  QuantifiersEnum.EXTENSION_RENEWAL,
  QuantifiersEnum.EXPANSION,
  QuantifiersEnum.DOWNGRADE,
  QuantifiersEnum.UPGRADE,
];

const PREDICATES_CONTAINS: Array<PredicatesEnum> = [
  PredicatesEnum.CONTAINS,
  PredicatesEnum.DOES_NOT_CONTAN,
];

const PREDICATES_SOLD: Array<PredicatesEnum> = [
  PredicatesEnum.WAS_SOLD_BY,
  PredicatesEnum.WAS_SOLD_TO,
  PredicatesEnum.WAS_NOT_SOLD_BY,
  PredicatesEnum.WAS_NOT_SOLD_TO,
];

const PREDICATES_EQUALS: Array<PredicatesEnum> = [
  PredicatesEnum.GREATER_THAN,
  PredicatesEnum.LESS_THAN,
  PredicatesEnum.EQUAL_TO,
  PredicatesEnum.NOT_EQUAL_TO,
];
export const SavedAlertRuleLogicConfig: Array<SavedAlertRuleLogicConfigType> = [
  /**
   * A LINE ITEM IN A QUOTE
   */
  {
    pre_quantifiers: [QuantifiersEnum.A_LINE_ITEM_IN_A_QUOTE],
    conditions: [
      {
        predicates: PREDICATES_CONTAINS,
        post_quantifiers: [
          ...QUANTIFIERS_PRODUCTS,
          QuantifiersEnum.DEAL_TYPE,
          ...QUANTIFIERS_VALUES_DOLLARS,
          ...QUANTIFIERS_VALUES_PERCENTS,
          ...QUANTIFIERS_UNIT,
          ...QUANTIFIERS_BILLING,
          ...QUANTIFIERS_TERMS,
          QuantifiersEnum.A_START_DATE,
          QuantifiersEnum.AN_END_DATE,
        ],
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_PRODUCTS,
    conditions: [
      {
        predicates: [PredicatesEnum.ARE],
        post_quantifiers: QuantifiersEnum.THE_FOLLOWING_PRODUCTS,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.DEAL_TYPE],
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QUANTIFIERS_DEAL,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_VALUES_DOLLARS,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DOLLARS,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_VALUES_PERCENTS,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.PERCENT,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_UNIT,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.UNITS,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_BILLING,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: [QuantifiersEnum.THE_DEFAULT_SETTINGS],
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_TERMS,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.YEARS,
      },
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DAYS,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.A_START_DATE],
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DAYS,
      },
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DATE,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.AN_END_DATE],
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DATE,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.A_SUBMITTED_QUOTE],
    conditions: [
      {
        predicates: PREDICATES_CONTAINS,
        post_quantifiers: [
          QuantifiersEnum.ANY_QUOTE_ATTRIBUTE,
          ...QUANTIFIERS_TRANSACTIONS,
          QuantifiersEnum.A_QUOTE_EXPIRATION,
          ...QUANTIFIERS_TEXT,
        ],
      },
      {
        predicates: PREDICATES_SOLD,
        post_quantifiers: QUANTIFIERS_SOLD,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.ANY_QUOTE_ATTRIBUTE],
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.RAW_TEXT,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_TRANSACTIONS,
    conditions: [
      {
        predicates: [PredicatesEnum.ARE],
        post_quantifiers: QUANTIFIERS_TRANSITIONS,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.A_QUOTE_EXPIRATION],
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.DATE,
      },
    ],
  },
  {
    pre_quantifiers: QUANTIFIERS_TEXT,
    conditions: [
      {
        predicates: PREDICATES_EQUALS,
        post_quantifiers: QuantifiersEnum.RAW_TEXT,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.THE_FOLLOWING_SALES_TEAM],
    conditions: [
      {
        predicates: [PredicatesEnum.ARE],
        post_quantifiers: QuantifiersEnum.THE_FOLLOWING_SALES_TEAM,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.THE_FOLLOWING_PARTNERS],
    conditions: [
      {
        predicates: [PredicatesEnum.ARE],
        post_quantifiers: QuantifiersEnum.THE_FOLLOWING_PARTNERS,
      },
    ],
  },
  {
    pre_quantifiers: [QuantifiersEnum.APPROVAL_EMAILS],
    conditions: [
      {
        predicates: [PredicatesEnum.SHOULD],
        post_quantifiers: QuantifiersEnum.THE_FOLLOWING_USERS,
      },
    ],
  },
];
