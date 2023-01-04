import create, { StateCreator } from "zustand";
import { devtools, persist, PersistOptions } from "zustand/middleware";
import { getPersistSerializer } from "@core/utils/store";

function buildStore<T extends Record<string, any>>(
  storeName: string,
  storeVersion: number = 1,
  stateCreator: StateCreator<T>,
  deserializeFallback?: (state: { state: T; version?: number }) => void
) {
  const myMiddlewares = (f: StateCreator<T, any>, option: PersistOptions<T>) =>
    process.env.NODE_ENV !== "production"
      ? (devtools(persist<T, any>(f, option)) as StateCreator<T, any, [["zustand/persist", any]]>)
      : (persist<T, any>(f, option) as StateCreator<T, any, [["zustand/persist", any]]>);

  return create<T>()(
    myMiddlewares(
      stateCreator as StateCreator<T, any>,
      getPersistSerializer<T>(storeName, storeVersion, deserializeFallback)
    )
  );
}

export default buildStore;
