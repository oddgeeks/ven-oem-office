export function appendToRecord(
  submittedRecord?: Record<any, any>,
) {
  const defaultRecord: Record<any, any> = {
    ...submittedRecord,
  };
  return defaultRecord;
}
