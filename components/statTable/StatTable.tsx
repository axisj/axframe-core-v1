import * as React from "react";
import styled from "@emotion/styled";

export interface StatCol {
  width?: number;
}

export interface StatHeadTd {
  colspan?: number;
  rowspan?: number;
  label: string;
}

export interface StatHeadTr {
  children?: StatHeadTd[];
}

interface StyleProps {
  headRowHeight?: number;
  bodyRowHeight?: number;
}
interface Props extends StyleProps {
  style?: React.CSSProperties;
  className?: string;
  colGroups: StatCol[];
  head: StatHeadTr[];
  children?: React.ReactNode;
}

function StatTable({ colGroups, head, children, headRowHeight = 34, bodyRowHeight = 34 }: Props) {
  const tableWidth = React.useMemo(() => {
    return colGroups.reduce((acc, cur) => {
      return acc + (cur.width ?? 0);
    }, 0);
  }, [colGroups]);

  return (
    <Container>
      <Table style={{ minWidth: tableWidth }} headRowHeight={headRowHeight} bodyRowHeight={bodyRowHeight}>
        <colgroup>
          {colGroups.map((cg, cgi) => (
            <col key={cgi} width={cg.width} />
          ))}
          <col />
        </colgroup>
        <thead>
          {head.map((h, hi) => (
            <tr key={hi}>
              {h.children?.map((th, thi) => (
                <th key={thi} colSpan={th.colspan} rowSpan={th.rowspan}>
                  {th.label}
                </th>
              ))}
              <th />
            </tr>
          ))}
        </thead>
        {children}
      </Table>
    </Container>
  );
}

const Container = styled.div`
  overflow: auto;
  border-radius: 4px;
  border: 1px solid ${(p) => p.theme.border_color_base};
`;
const Table = styled.table<StyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;
  background: ${(p) => p.theme.component_background};

  thead th {
    white-space: nowrap;
    border: 1px solid ${(p) => p.theme.border_color_base};
    background: ${(p) => p.theme.axfdg_header_bg};
    text-align: center;
    line-height: 20px;
    padding: 0 6.5px;
    height: ${(p) => p.headRowHeight}px;
  }

  tbody td {
    white-space: nowrap;
    border: 1px solid ${(p) => p.theme.border_color_base};
    text-align: center;
    line-height: 20px;
    padding: 0 6.5px;
    height: ${(p) => p.bodyRowHeight}px;
  }
`;

StatTable.tbody = styled.tbody``;
StatTable.tr = styled.tr``;
StatTable.td = styled.td``;

export { StatTable };
