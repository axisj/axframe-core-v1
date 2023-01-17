import * as React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import i18n from "i18n";
import { useAppStore } from "stores";

export interface IErrorDialogOptions {
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  content: React.ReactNode;
  message?: string;
  code?: number;
  className?: string;
  width?: string | number;
}

export const errorDialog = (
  options: IErrorDialogOptions,
  isMounted?: React.MutableRefObject<boolean>
): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    if (isMounted && !isMounted.current) {
      return resolve(true);
    }

    const currentLanguage = useAppStore.getState().currentLanguage;
    const t = i18n[currentLanguage ?? "en"];

    Modal.error({
      icon: options.icon === null ? null : options.icon || <CloseCircleOutlined />,
      autoFocusButton: "ok",
      className: options.className,
      okText: t.button.ok,
      cancelText: t.button.cancel,
      transitionName: "slide-down",
      title: options.title ?? `Error ${options.code}`,
      content: options.content || options.message || "Unknown error occurred",
      width: options.width,
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
