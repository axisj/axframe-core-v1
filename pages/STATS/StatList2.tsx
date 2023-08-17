import * as React from "react";
import styled from "@emotion/styled";
import { useContainerSize } from "@core/hooks";
import { StatDataGrid } from "@core/components/StatDataGrid";
import { use$STATS$Store } from "./use$STATS$Store";
import { StatRowTd } from "@core/components/statTable";

interface Props {}

function StatList2({}: Props) {
  const _colGroups = use$STATS$Store((s) => s.colGroupsPg2);
  const setColGroups = use$STATS$Store((s) => s.setColGroupsPg2);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const colGroups = React.useMemo(() => {
    return _colGroups ?? [{ width: 100 }, { width: 60 }, { width: 120 }, { width: 120 }, { width: 120 }];
  }, [_colGroups]);

  const rawBodyData: StatRowTd[][] = React.useMemo(() => {
    return [
      [
        {
          value: "ABC",
          rowspan: 2,
        },
        {
          value: "Normal",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "4",
          align: "right",
          rowspan: 2,
        },
      ],
      [
        {
          value: "Special",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
      ],
      [
        {
          value: "BCD",
          rowspan: 2,
        },
        {
          value: "Normal",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "4",
          align: "right",
          rowspan: 2,
        },
      ],
      [
        {
          value: "Special",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
      ],
      [
        {
          value: "CDE",
          rowspan: 2,
        },
        {
          value: "Normal",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "4",
          align: "right",
          rowspan: 2,
        },
      ],
      [
        {
          value: "Special",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
      ],
    ];
  }, []);

  const rawTotalData: StatRowTd[][] = React.useMemo(() => {
    return [
      [
        {
          value: "ABC",
          rowspan: 3,
        },
        {
          value: "Normal",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
        {
          value: "1",
          align: "right",
        },
      ],
    ];
  }, []);

  return (
    <Container ref={containerRef}>
      <StatDataGrid
        width={containerWidth}
        height={containerHeight}
        headRowHeight={60}
        bodyRowHeight={34}
        colGroups={colGroups}
        onChangeColGroups={setColGroups}
        headColumns={[
          {
            children: [
              { label: "H1", rowspan: 2, colspan: 2 },
              { label: "H2", colspan: 2 },
              { label: "Sum", rowspan: 2 },
            ],
          },
          {
            children: [{ label: "h2-1" }, { label: "h2-2" }],
          },
        ]}
        rawBodyData={rawBodyData}
        rawTotalData={rawTotalData}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { StatList2 };
