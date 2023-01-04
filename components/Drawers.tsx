import * as React from "react";
import { useDrawerStore } from "stores";

function Drawers() {
  const drawers = useDrawerStore((s) => s.drawers);
  return (
    <>
      {[...drawers].map(
        ([
          key,
          {
            drawer: { drawerFactory },
            resolve,
            reject,
            open,
            onClose,
            afterOpenChange,
          },
        ]) => {
          if (drawerFactory) {
            return (
              <React.Fragment key={key}>
                {drawerFactory(open, resolve, reject, onClose, afterOpenChange)}
              </React.Fragment>
            );
          }

          return null;
        }
      )}
    </>
  );
}

export { Drawers };
