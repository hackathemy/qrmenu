import { AxiosResponse } from "axios";
export * from './file'
export { setBaseUrl, setBearerAuthorization, apiClient } from "./client";

export interface ApiError
  extends AxiosResponse<{
    code: number;
    domain: string;
    status: number;
    message: string;
  }> {}
