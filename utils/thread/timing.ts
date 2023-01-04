import type { DebouncedFunc, DebounceSettings } from "lodash";
import { debounce, memoize } from "lodash";

export const delay = <T>(ms: number, result?: T): Promise<T> =>
  new Promise<T>((res) => setTimeout(() => res(result as T), ms));

export function memoizeDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: DebounceSettings = {}
): (...args: Parameters<T>) => ReturnType<DebouncedFunc<T>> {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const mem = memoize(function (_param: string) {
    return debounce(func, wait, options);
  });

  return function (...args: Parameters<T>) {
    const _args: string = args
      .map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg);
          } catch (error) {}
        }
        return undefined;
      })
      .filter((arg) => typeof arg === "string")
      .join("|");

    return mem(_args)(...args);
  };
}
