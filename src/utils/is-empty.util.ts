export function isEmpty(
  val: string | null | undefined,
): val is null | undefined {
  return val === null || val === undefined || String(val).trim() === '';
};