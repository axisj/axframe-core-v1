import * as React from "react";
import { ItemTotal, StatBodyTd, StatCol, StatSubTotal, StatTableStyleProps } from "./types";
import { toMoney } from "@core/utils/number";
import styled from "@emotion/styled";

interface Props<T> {
  tableWidth: number;
  bodyRowHeight: number;
  colGroups: StatCol[];
  cdata: Record<string, any>[];
  subtotal?: StatSubTotal<T>;
  bodyColumns: StatBodyTd<T>[];
  onClick?: (rowIndex: number, item: T) => void;
  selectedRowIndex?: number;
}

function StatTableTBody<T>({
  tableWidth,
  bodyRowHeight,
  colGroups,
  cdata,
  subtotal,
  bodyColumns,
  onClick,
  selectedRowIndex,
}: Props<T>) {
  return (
    <Table style={{ minWidth: tableWidth }} bodyRowHeight={bodyRowHeight}>
      <colgroup>
        {colGroups.map((cg, cgi) => (
          <col key={cgi} width={cg.width} />
        ))}
        <col />
      </colgroup>
      <tbody>
        {cdata?.map((item, ri) => {
          if (item["__subtotal__"]) {
            return (
              <tr key={ri} role={"subtotal"}>
                {subtotal?.columns.map((sc, si) => {
                  const tdValue = (() => {
                    if (sc.key) {
                      if (sc.itemRender) {
                        return sc.itemRender(item[sc.key], item as Record<keyof T, ItemTotal>);
                      }

                      if (sc.totalType === "avg") {
                        return toMoney((item[sc.key].sum / item[sc.key].count).toFixed(2));
                      }
                      return toMoney(item[sc.key][sc.totalType ?? "sum"]);
                    }
                    return sc.label;
                  })();

                  return (
                    <td
                      key={si}
                      colSpan={sc.colspan}
                      align={sc.align ?? "center"}
                      data-text-cell={sc.textCell}
                      className={sc.className}
                    >
                      {tdValue}
                    </td>
                  );
                })}
                <td className={"dummy"} />
              </tr>
            );
          }

          return (
            <tr key={ri} className={ri === selectedRowIndex ? "selected" : ""}>
              {bodyColumns.map((c, ci) => {
                if (item[c.key].rowspan) {
                  const tdValue = c.itemRender ? c.itemRender(item.__originValue__) : item[c.key].originValue;
                  return (
                    <td
                      key={ci}
                      rowSpan={item[c.key].rowspan}
                      role={onClick ? "click-item" : ""}
                      onClick={(evt) => {
                        if (item[c.key].rowspan < 2) {
                          onClick?.(ri, item.__originValue__);
                        }
                      }}
                      align={c.align ?? "center"}
                      className={c.className}
                      data-text-cell={c.textCell}
                    >
                      {tdValue}
                    </td>
                  );
                }
              })}
              <td className={"dummy"} />
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

const Table = styled.table<StatTableStyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;
  background: ${(p) => p.theme.component_background};
  border-bottom: 1px solid ${(p) => p.theme.border_color_base};

  tbody {
    td {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.bodyRowHeight}px;
      color: ${(p) => p.theme.axfdg_body_color};

      overflow: hidden;
      text-overflow: ellipsis;

      &[role="click-item"] {
        cursor: pointer;
      }
    }

    tr.selected {
      background: ${(p) => p.theme.item_active_bg};
      color: ${(p) => p.theme.primary_color};
    }
    tr[role="subtotal"] {
      td {
        background: #ffeeee;
      }
    }
  }
`;

export { StatTableTBody };
