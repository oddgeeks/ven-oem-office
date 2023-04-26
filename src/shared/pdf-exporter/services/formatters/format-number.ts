export function formatNumber(
  value: number,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minimumFractionDigits || 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: maximumFractionDigits || 0, // (causes 2500.99 to be printed as $2,501)
  });

  // Zero as default number instead of NaN
  return formatter.format(isNaN(value) ? 0 : value);
}
