import { ApiErrorCode } from "@types";

export class CustomError extends Error {
  public code: number;

  public constructor(code: number | ApiErrorCode | string, message?: string) {
    if (typeof code === "string") {
      super(code);
      this.code = Number(ApiErrorCode.Alert);
    } else {
      super(message);
      this.code = code as number;
    }
  }
}
