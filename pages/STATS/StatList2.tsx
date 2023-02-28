import * as React from "react";
import styled from "@emotion/styled";
import { StatCol } from "@core/components/statTable";
import { useContainerSize } from "@core/hooks";
import { StatDataGrid } from "@core/components/StatDataGrid";

interface Props {}

function StatList2({}: Props) {
  const [colGroups, setColGroups] = React.useState<StatCol[]>([
    { width: 100 },
    { width: 200 },
    { width: 100 },
    { width: 100 },
  ]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <StatDataGrid
        width={containerWidth}
        height={containerHeight}
        headRowHeight={28}
        bodyRowHeight={34}
        colGroups={colGroups}
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
