import * as React from "react";
import { StatCol, StatHeadTr, StatTableStyleProps } from "./types";
import styled from "@emotion/styled";
import StatTableColResizer from "./StatTableColResizer";
import { dangerouslySetInnerHTML } from "../../utils/string";

interface Props {
  marginLeft?: number;
  tableWidth: number;
  colGroups: StatCol[];
  headColumns: StatHeadTr[];
  headRowHeight: number;
  onChangeColGroups: (colGroups: StatCol[]) => void;
}

function StatTableTHead({ marginLeft, tableWidth, colGroups, headColumns, headRowHeight, onChangeColGroups }: Props) {
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

  const onChangeColWidth = React.useCallback(
    (ci: number, width: number) => {
      colGroups[ci].width = width;
      onChangeColGroups([...colGroups]);
    },
    [colGroups, onChangeColGroups]
  );

  return (
    <Container ref={containerRef} style={{ width: tableWidth, marginLeft }}>
      <Table headRowHeight={headRowHeight}>
        <colgroup>
          {colGroups.map((cg, cgi) => (
            <col key={cgi} width={cg.width} />
          ))}
        </colgroup>
        <thead>
          {headColumns.map((h, hi) => (
            <tr key={hi}>
              {h.children?.map((th, thi) => {
                return (
                  <th
                    key={thi}
                    colSpan={th.colspan}
                    rowSpan={th.rowspan}
                    align={th.align ?? "center"}
                    {...dangerouslySetInnerHTML(th.label)}
                  ></th>
                );
              })}
            </tr>
          ))}
        </thead>
      </Table>
      {colGroupsWithPosition.map((cg, cgi) => {
        return (
          <StatTableColResizer
            key={cgi}
            container={containerRef}
            columnIndex={0}
            left={cg.left - 7}
            width={cg.width ?? 0}
            onChangeWidth={(width) => onChangeColWidth(cgi, width)}
          />
        );
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
  height: ${(p) => p.headRowHeight}px;

  thead {
    th {
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      background: ${(p) => p.theme.axfdg_header_bg};
      padding: 0 6.5px;
      color: ${(p) => p.theme.axfdg_header_color};
      font-weight: ${(p) => p.theme.axfdg_header_font_weight};

      overflow: hidden;
      text-overflow: ellipsis;
    }

    td:last-child {
      background: transparent;
    }
  }
`;

export { StatTableTHead };
