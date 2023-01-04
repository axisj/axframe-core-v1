import { MousePosition } from "@types";

export type DragEventSubscribeCallbackFn = (mousePosition: MousePosition, stopEvent: () => void) => void;

export const dragEventSubscribe = (callBack: DragEventSubscribeCallbackFn, onEnd: () => void): void => {
  const onDragWindow = (e: DragEvent): void => {
    callBack(
      {
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
      },
      () => {
        onDragendWindow();
      }
    );
  };

  const onDragendWindow = (): void => {
    window.removeEventListener("drag", onDragWindow);
    window.removeEventListener("dragend", onDragendWindow);
    onEnd?.();
  };

  window.addEventListener("drag", onDragWindow, false);
  window.addEventListener("dragend", onDragendWindow);
};
