export interface Response<T> {
  status: number;
  message: string;
  success: boolean;
  data: T;
}
