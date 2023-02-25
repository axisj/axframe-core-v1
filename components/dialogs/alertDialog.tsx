import * as React from "react";
import { Modal } from "antd";
import i18n from "i18n";
import { useAppStore } from "stores";
import { dangerouslySetInnerHTML } from "@core/utils/string";

export interface IAlertDialogOptions {
  title?: string | React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const alertDialog = (
  options: IAlertDialogOptions,
  isMounted?: React.MutableRefObject<boolean>
): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    if (isMounted && !isMounted.current) {
      return resolve(true);
    }

    const currentLanguage = useAppStore.getState().currentLanguage;
    const t = i18n[currentLanguage ?? "en"];

    const modalContent =
      typeof options.content === "string" ? (
        <span {...dangerouslySetInnerHTML(options.content.replace(/[<>\\\/'"-]/g, "\\$&"))} />
      ) : (
        options.content
      );

    Modal.info({
      autoFocusButton: "ok",
      className: options.className,
      okText: t.button.ok,
      cancelText: t.button.cancel,
      transitionName: "slide-down",
      title: options.title ?? "Alert",
      content: options.content ? modalContent : "",
      bodyStyle: {
        padding: 15,
      },
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
