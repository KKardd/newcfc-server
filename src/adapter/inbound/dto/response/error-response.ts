export interface ErrorResponse {
  timestamp: string;
  path: string;
  method: string;
  httpStatus: number;
  message: string;
  errorCode?: string;
}
