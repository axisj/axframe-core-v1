import { getI18n } from "@core/hooks";
import { ApiErrorCode } from "@types";
import { alertDialog, errorDialog } from "@core/components/dialogs";

export async function errorHandler(err: any, msgs?: Record<string, any>) {
  const { t } = getI18n();

  if (err === "confirm_cancel") {
    return true;
  }
  if (err?.code) {
    if (err.code === "ERR_CANCELED") {
      return true;
    }
    if (err.code === ApiErrorCode.SAME_REQ_EXCEPTION) {
      return true;
    }

    if (err?.code === ApiErrorCode.SQL_DUPLICATE_ERROR) {
      await alertDialog({
        content: msgs?.[ApiErrorCode.SQL_DUPLICATE_ERROR] ?? t.apiErrMsg[ApiErrorCode.SQL_DUPLICATE_ERROR],
      });
    } else {
      await errorDialog(err);
    }
  } else {
    if (err?.message) {
      await alertDialog({ content: err.message });
    }
  }
}
