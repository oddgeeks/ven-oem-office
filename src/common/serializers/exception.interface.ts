export interface Exception<T> {
  status: number;
  message: string;
  success: boolean;
  error: T;
}
