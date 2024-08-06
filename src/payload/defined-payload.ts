/* eslint-disable prettier/prettier */
export class DefinedApiResponse {
  constructor(
    public success: boolean,
    public error?: string,
    public data?: any,
  ) {}
}
