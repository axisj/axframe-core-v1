import * as React from "react";

export const useUnmountEffect = (fn) => {
  const fnRef = React.useRef(fn);
  fnRef.current = fn;

  React.useEffect(() => () => fnRef.current(), []);
};
