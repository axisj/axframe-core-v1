import * as React from "react";
import styled from "@emotion/styled";
import { StatTableProps, StatTableStyleProps } from "./types";
import { StatTableTHead } from "./StatTableTHead";
import { StatTableTBody } from "./StatTableTBody";
import { StatTableTFoot } from "./StatTableTFoot";
import { Loading } from "../common";

function StatTable<T = Record<string, any>>({
  spinning,
  headRowHeight = 34,
  bodyRowHeight = 34,
  colGroups,
  headColumns,
  bodyColumns,
  subtotal,
  total,
  data,
}: StatTableProps<T>) {
  const tableWidth = React.useMemo(() => {
    return colGroups.reduce((acc, cur) => {
      return acc + (cur.width ?? 0);
    }, 0);
  }, [colGroups]);

  const { newData: cdata, totalValues } = React.useMemo(() => {
    const newData = [] as Record<string, any>[];
    let subTotalValues: Record<string, any> = {};
    const totalValues: Record<string, any> = {};

    for (let i = 0; i < data.length; i++) {
      const prevItem = data[i - 1] as T;
      const curItem = data[i] as T;
      const nextItem = data[i + 1] as T;

      const newItem: Record<string, any> = {
        __originValue__: { ...curItem },
      };
      bodyColumns.forEach((bc) => {
        if (!bc.key) return;

        newItem[bc.key] = {
          originValue: curItem[bc.key],
          rowspan: 1,
        };

        if (subtotal?.columns.find((sc) => sc.key === bc.key)) {
          if (bc.key in subTotalValues) {
            subTotalValues[bc.key].sum += curItem[bc.key];
            subTotalValues[bc.key].count += 1;
          } else {
            subTotalValues[bc.key] = {
              sum: curItem[bc.key],
              count: 1,
            };
          }
        }

        if (total?.columns.find((tc) => tc.key === bc.key)) {
          if (bc.key in totalValues) {
            totalValues[bc.key].sum += curItem[bc.key];
            totalValues[bc.key].count += 1;
          } else {
            totalValues[bc.key] = {
              sum: curItem[bc.key],
              count: 1,
            };
          }
        }

        if (prevItem && bc.isRowMerge?.(prevItem, curItem)) {
          const parentIndex = newData[newData.length - 1][bc.key].parentIndex ?? newData.length - 1;
          newData[parentIndex][bc.key].rowspan += 1;
          newItem[bc.key].rowspan = 0;
          newItem[bc.key].parentIndex = parentIndex;
        }
      });

      newData.push(newItem);

      if (!nextItem || subtotal?.condition(curItem, nextItem)) {
        newData.push({
          __subtotal__: true,
          ...subTotalValues,
        });
        subTotalValues = {};
      }
    }

    return {
      newData,
      totalValues,
    };
  }, [bodyColumns, data, subtotal, total?.columns]);

  return (
    <Container>
      <Table style={{ minWidth: tableWidth }} headRowHeight={headRowHeight} bodyRowHeight={bodyRowHeight}>
        <colgroup>
          {colGroups.map((cg, cgi) => (
            <col key={cgi} width={cg.width} />
          ))}
          <col />
        </colgroup>
        <StatTableTHead headColumns={headColumns} />
        <StatTableTBody cdata={cdata} subtotal={subtotal} bodyColumns={bodyColumns} />
        <StatTableTFoot total={total} totalValues={totalValues} />
      </Table>
      <Loading active={spinning} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid ${(p) => p.theme.border_color_base};
`;
const Table = styled.table<StatTableStyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;
  background: ${(p) => p.theme.component_background};

  thead {
    th {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      background: ${(p) => p.theme.axfdg_header_bg};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.headRowHeight}px;
    }
  }

  tbody {
    td {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.bodyRowHeight}px;
    }

    tr[role="subtotal"] {
      td {
        background: #ffeeee;
      }
    }
  }

  tfoot {
    td {
      background: #eee;
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.bodyRowHeight}px;
    }
  }
`;

StatTable.tbody = styled.tbody``;
StatTable.tr = styled.tr``;
StatTable.td = styled.td``;

export { StatTable };
