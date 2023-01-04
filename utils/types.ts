export interface IMousePosition {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

export type MouseEventSubscribeCallbackFn = (mousePosition: IMousePosition, stopEvent: () => void) => void;

export type DragEventSubscribeCallbackFn = (mousePosition: IMousePosition, stopEvent: () => void) => void;

export interface IMouseEventSubscribeOptions {
  interval?: number;
}
