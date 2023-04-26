export type formatCurrencyOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  value: number,
  currency = 'USD',
  options: formatCurrencyOptions = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  },
): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    ...options,
  });

  // Zero as default number instead of NaN
  return formatter.format(isNaN(value) ? 0 : value);
}
