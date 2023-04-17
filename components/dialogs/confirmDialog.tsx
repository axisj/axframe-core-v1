import * as React from "react";
import { Modal } from "antd";
import i18n from "i18n";
import { useAppStore } from "stores";
import { reject } from "lodash";

export interface IConfirmDialogOptions {
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  content: React.ReactNode;
  message?: string;
  className?: string;
  width?: string | number;
}

export const confirmDialog = (
  options: IConfirmDialogOptions,
  isMounted?: React.MutableRefObject<boolean>
): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    if (isMounted && !isMounted.current) {
      return resolve(true);
    }

    const currentLanguage = useAppStore.getState().currentLanguage;
    const t = i18n[currentLanguage ?? "en"];

    Modal.confirm({
      autoFocusButton: "ok",
      className: options.className,
      okText: t.button.ok,
      cancelText: t.button.cancel,
      transitionName: "slide-down",
      title: options.title === null ? null : options.title || "Confirm",
      content: options.content || options.message || "Unknown error occurred",
      width: options.width,
      bodyStyle: {
        padding: 15,
      },
      onOk() {
        resolve(true);
      },
      onCancel() {
        reject("");
      },
    });
  });
