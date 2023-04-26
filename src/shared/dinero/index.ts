import * as Dinero from 'dinero.js';

export const isInstanceOfDinero = (money: any): boolean => {
  // assume that money is Dinero instance if the money has getAmount and getCurrency property
  return !!(money && money.getAmount && money.getCurrency);
};

export function newDinero(
  amountInCents: number,
  currency: Dinero.Currency = 'USD',
): Dinero.Dinero {
  if (isNaN(amountInCents)) {
    throw new Error('amount should be a number');
  }

  // amount is comming as cent, so we round it to integer
  const rounderAmountInCents = Math.round(amountInCents);

  return Dinero({ amount: rounderAmountInCents, currency });
}

export function newDineroDollars(
  amountInDollars: number,
  currency: Dinero.Currency = 'USD',
): Dinero.Dinero {
  return newDinero(amountInDollars * 100, currency);
}

export function convertAnyDineroPropertiesToAmount(params: any) {
  for (const param in params) {
    if (isInstanceOfDinero(params[param])) {
      params[param] = params[param].getAmount();
    }
  }
}
