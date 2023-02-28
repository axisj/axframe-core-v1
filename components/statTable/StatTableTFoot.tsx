import * as React from "react";
import { StatTotal } from "./types";
import { toMoney } from "../../utils/number";

interface Props {
  total?: StatTotal;
  totalValues: Record<string, any>;
}

function StatTableTFoot({ total, totalValues }: Props) {
  if (!total) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        {total.columns.map((sc, si) => {
          const tdValue = (() => {
            if (sc.key) {
              if (sc.itemRender) {
                return sc.itemRender(totalValues[sc.key]);
              }

              if (sc.totalType === "avg") {
                return toMoney((totalValues[sc.key].sum / totalValues[sc.key].count).toFixed(2));
              }
              return toMoney(totalValues[sc.key][sc.totalType ?? "sum"]);
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
    </tfoot>
  );
}

export { StatTableTFoot };
