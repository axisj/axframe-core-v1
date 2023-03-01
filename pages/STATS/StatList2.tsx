import * as React from "react";
import styled from "@emotion/styled";
import { useContainerSize } from "@core/hooks";
import { StatDataGrid } from "@core/components/StatDataGrid";
import { use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function StatList2({}: Props) {
  const _colGroups = use$STATS$Store((s) => s.colGroupsPg2);
  const setColGroups = use$STATS$Store((s) => s.setColGroupsPg2);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const colGroups = React.useMemo(() => {
    return _colGroups ?? [{ width: 100 }, { width: 200 }, { width: 100 }, { width: 100 }];
  }, [_colGroups]);

  return (
    <Container ref={containerRef}>
      <StatDataGrid
        width={containerWidth}
        height={containerHeight}
        headRowHeight={28}
        bodyRowHeight={34}
        colGroups={colGroups}
        onChangeColGroups={setColGroups}
        headColumns={[
          {
            children: [{ label: "h1", rowspan: 2 }, { label: "h2" }, { label: "h3", colspan: 2 }],
          },
          {
            children: [{ label: "h2" }, { label: "h3" }, { label: "h4" }],
          },
        ]}
        bodyColumns={[]}
        data={[]}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { StatList2 };
