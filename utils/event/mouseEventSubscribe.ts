import { throttle } from "lodash";
import { MousePosition } from "@types";

export type MouseEventSubscribeCallbackFn = (mousePosition: MousePosition, stopEvent: () => void) => void;

export interface MouseEventSubscribeOptions {
  interval?: number;
}

export const mouseEventSubscribe = (
  callBack: MouseEventSubscribeCallbackFn,
  onEnd?: () => void,
  options?: MouseEventSubscribeOptions
): void => {
  const { interval = 30 } = options || {};
  const throttledCallBack = throttle((e: MouseEvent): void => {
    callBack(
      {
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
      },
      () => {
        onMouseupWindow();
      }
    );
  }, interval);

  const onMousemoveWindow = (e: MouseEvent): void => {
    throttledCallBack(e);
  };

  const onMouseupWindow = (): void => {
    window.removeEventListener("mousemove", onMousemoveWindow);
    window.removeEventListener("mouseup", onMouseupWindow);
    window.removeEventListener("mouseleave", onMouseupWindow);
    document.body.style.userSelect = "inherit";
    document.body.style.webkitUserSelect = "inherit";
    throttledCallBack.cancel();
    onEnd?.();
  };

  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";
  window.addEventListener("mousemove", onMousemoveWindow, false);
  window.addEventListener("mouseup", onMouseupWindow);
  window.addEventListener("mouseleave", onMouseupWindow);
};
