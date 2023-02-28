import * as React from "react";
import { StatBodyTd, StatSubTotal } from "./types";
import { toMoney } from "../../utils/number";

interface Props<T> {
  cdata: Record<string, any>[];
  subtotal?: StatSubTotal<T>;
  bodyColumns: StatBodyTd<T>[];
}

function StatTableTBody<T>({ cdata, subtotal, bodyColumns }: Props<T>) {
  return (
    <tbody>
      {cdata?.map((item, ri) => {
        if (item["__subtotal__"]) {
          return (
            <tr key={ri} role={"subtotal"}>
              {subtotal?.columns.map((sc, si) => {
                const tdValue = (() => {
                  if (sc.key) {
                    if (sc.itemRender) {
                      return sc.itemRender(item[sc.key]);
                    }

                    if (sc.totalType === "avg") {
                      return toMoney((item[sc.key].sum / item[sc.key].count).toFixed(2));
                    }
                    return toMoney(item[sc.key][sc.totalType ?? "sum"]);
                  }
                  return sc.label;
                })();

                return (
                  <td key={si} colSpan={sc.colspan} align={sc.align ?? "center"}>
                    {tdValue}
                  </td>
                );
              })}
              <td />
            </tr>
          );
        }

        return (
          <tr key={ri}>
            {bodyColumns.map((c, ci) => {
              if (item[c.key].rowspan) {
                const tdValue = c.itemRender ? c.itemRender(item.__originValue__) : item[c.key].originValue;
                return (
                  <td key={ci} rowSpan={item[c.key].rowspan} align={c.align ?? "center"}>
                    {tdValue}
                  </td>
                );
              }
            })}
            <td />
          </tr>
        );
      })}
    </tbody>
  );
}

export { StatTableTBody };
