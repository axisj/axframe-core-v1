import { ApiErrorCode } from "../../@types";

export class CustomError extends Error {
  public code: number;

  public constructor(code: number | ApiErrorCode, message?: string) {
    super(message);
    this.code = code as number;
  }
}
