import * as React from "react";
import { ItemTotal, StatCol, StatTableStyleProps, StatTotal } from "./types";
import { toMoney } from "@core/utils/number";
import styled from "@emotion/styled";

interface Props<T> {
  marginLeft?: number;
  colGroups: StatCol[];
  total?: StatTotal<T>;
  totalValues: Record<string, any>;
  tableWidth: number;
  bodyRowHeight: number;
}

function StatTableTFoot<T>({ marginLeft, colGroups, total, totalValues, tableWidth, bodyRowHeight }: Props<T>) {
  if (!total) {
    return null;
  }

  return (
    <Table style={{ minWidth: tableWidth, marginLeft }} bodyRowHeight={bodyRowHeight}>
      <colgroup>
        {colGroups.map((cg, cgi) => (
          <col key={cgi} width={cg.width} />
        ))}
        <col />
      </colgroup>
      <tfoot>
        <tr>
          {total.columns.map((sc, si) => {
            const tdValue = (() => {
              if (sc.key) {
                if (totalValues[sc.key]) {
                  if (sc.itemRender) {
                    return sc.itemRender(totalValues[sc.key], totalValues as Record<keyof T, ItemTotal>);
                  }

                  if (sc.totalType === "avg") {
                    return toMoney((totalValues[sc.key].sum / totalValues[sc.key].count).toFixed(2));
                  }
                  return toMoney(totalValues[sc.key][sc.totalType ?? "sum"]);
                }
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
    </Table>
  );
}

const Table = styled.table<StatTableStyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;

  tfoot {
    td {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.bodyRowHeight}px;

      overflow: hidden;
      text-overflow: ellipsis;
    }
    td:last-child {
      background: transparent;
    }
  }
`;

export { StatTableTFoot };
