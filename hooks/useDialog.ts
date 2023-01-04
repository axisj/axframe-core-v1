import * as React from "react";
import { errorDialog } from "@core/components/dialogs/errorDialog";
import { useIsMounted } from "@core/hooks/useIsMounted";
import { confirmDialog, IConfirmDialogOptions } from "../components/dialogs/confirmDialog";
import { alertDialog, IAlertDialogOptions } from "../components/dialogs/alertDialog";

export function useDialog() {
  const isMounted = useIsMounted();

  const callErrorDialog = React.useCallback(
    async (options: unknown) => {
      await errorDialog(options as any, isMounted);
    },
    [isMounted]
  );

  const callConfirmDialog = React.useCallback(
    async (options: IConfirmDialogOptions) => {
      await confirmDialog(options, isMounted);
    },
    [isMounted]
  );

  const callAlertDialog = React.useCallback(
    async (options: IAlertDialogOptions) => {
      await alertDialog(options, isMounted);
    },
    [isMounted]
  );

  return {
    errorDialog: callErrorDialog,
    confirmDialog: callConfirmDialog,
    alertDialog: callAlertDialog,
  };
}
