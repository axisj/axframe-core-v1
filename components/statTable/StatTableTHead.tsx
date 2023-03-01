import * as React from "react";
import { StatCol, StatHeadTr, StatTableStyleProps } from "./types";
import styled from "@emotion/styled";
import StatTableColResizer from "./StatTableColResizer";

interface Props {
  marginLeft: number;
  tableWidth: number;
  colGroups: StatCol[];
  headColumns: StatHeadTr[];
  headRowHeight: number;
}

function StatTableTHead({ marginLeft, tableWidth, colGroups, headColumns, headRowHeight }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const colGroupsWithPosition = React.useMemo(() => {
    let left = 0;
    return colGroups.map((cg) => {
      left = left + (cg.width ?? 0);

      return {
        width: cg.width,
        left,
      };
    });
  }, [colGroups]);

  return (
    <Container ref={containerRef} style={{ width: tableWidth, marginLeft }}>
      <Table headRowHeight={headRowHeight}>
        <colgroup>
          {colGroups.map((cg, cgi) => (
            <col key={cgi} width={cg.width} />
          ))}
          <col />
        </colgroup>
        <thead>
          {headColumns.map((h, hi) => (
            <tr key={hi}>
              {h.children?.map((th, thi) => (
                <th key={thi} colSpan={th.colspan} rowSpan={th.rowspan} align={th.align ?? "center"}>
                  {th.label}
                </th>
              ))}
              <th />
            </tr>
          ))}
        </thead>
      </Table>
      {colGroupsWithPosition.map((cg, cgi) => {
        return <StatTableColResizer key={cgi} container={containerRef} columnIndex={0} left={cg.left - 7} />;
      })}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Table = styled.table<StatTableStyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;

  thead {
    th {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      background: ${(p) => p.theme.axfdg_header_bg};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.headRowHeight}px;
    }

    td:last-child {
      background: transparent;
    }
  }
`;

export { StatTableTHead };
