import * as React from "react";

export function useSpinning<T = Record<string, any>>(initialState?: T) {
  const [_spinning, set_spinning] = React.useState<T | undefined>(initialState);

  const setSpinning = React.useCallback(
    (state: Partial<T>) => {
      const data = {
        ..._spinning,
        ...state,
      } as T;

      set_spinning(data);
    },
    [_spinning]
  );

  return {
    isBusy: Object.values(_spinning ?? {}).find(Boolean),
    spinning: _spinning,
    setSpinning,
  };
}
