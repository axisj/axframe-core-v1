import * as React from "react";
import styled from "@emotion/styled";
import { StatCol, StatTable } from "@core/components/statTable";

interface Props {}

function PanelPg2({}: Props) {
  const [colGroups, setColGroups] = React.useState<StatCol[]>([
    { width: 100 },
    { width: 200 },
    { width: 100 },
    { width: 100 },
  ]);

  return (
    <Container>
      <StatTable
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

const Container = styled.div``;

export { PanelPg2 };
