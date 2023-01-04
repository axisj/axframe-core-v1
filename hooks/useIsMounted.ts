import * as React from "react";

export function useIsMounted(): React.MutableRefObject<boolean> {
  // component is certainly mounted from the beginning
  const componentIsMounted = React.useRef(true);

  React.useEffect(() => {
    // when non-SSR + (ComponentDidMount or ComponentDidUpdate):
    // do nothing.
    // when non-SSR + ComponentWillUnmount:
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return componentIsMounted;
}
