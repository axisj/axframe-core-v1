import * as React from "react";

export function useDidMountEffect(fn: React.EffectCallback): void {
  const didMountRef = React.useRef(false);

  if (!didMountRef.current) {
    fn();
  }
  didMountRef.current = true;
}
