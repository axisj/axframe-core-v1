import * as React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Divider, Modal } from "antd";
import i18n from "i18n";
import { useAppStore } from "stores";
import { ErrorCommonMsg } from "components/common/ErrorCommonMsg";
import { CustomError } from "@core/services/CustomError";
import { ApiErrorCode } from "@types";

export interface IErrorDialogOptions {
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  content: string | React.ReactNode;
  message?: string;
  code?: number;
  className?: string;
  width?: string | number;
}

export const errorDialog = (
  options: IErrorDialogOptions | CustomError,
  isMounted?: React.MutableRefObject<boolean>
): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    if (isMounted && !isMounted.current) {
      return resolve(true);
    }

    const currentLanguage = useAppStore.getState().currentLanguage;
    const t = i18n[currentLanguage ?? "en"];
    let dialogConfig: IErrorDialogOptions = {
      content: "",
    };

    if (options instanceof CustomError) {
      dialogConfig = {
        title: Object.entries(ApiErrorCode).find(([k, v]) => v === `${options.code}`)?.[0],
        content:
          options.code && t.apiErrMsg[options.code]
            ? t.apiErrMsg[options.code] + (options.message ? ` [${options.message}]` : "")
            : "",
        message: options.message,
        code: options.code,
      };
    } else {
      if (options.code && t.apiErrMsg[options.code]) {
        options.content = t.apiErrMsg[options.code] + (options.message ? ` [${options.message}]` : "");
      }

      if (!options.code) {
        options.title = "Error";
      }

      dialogConfig = { ...options };
    }

    Modal.error({
      icon: dialogConfig.icon === null ? null : dialogConfig.icon || <CloseCircleOutlined />,
      autoFocusButton: "ok",
      className: dialogConfig.className,
      okText: t.button.ok,
      cancelText: t.button.cancel,
      transitionName: "slide-down",
      title: dialogConfig.title ?? `Error ${options.code}`,
      content: (
        <>
          {dialogConfig.content || options.message || "Unknown error occurred"} <Divider style={{ margin: "10px 0" }} />
          <ErrorCommonMsg />
        </>
      ),
      width: dialogConfig.width,
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
