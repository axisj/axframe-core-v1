import * as React from "react";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import { StatList1 } from "./StatList1";
import { RowResizer } from "@core/components/common";
import { use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function PanelPg1({}: Props) {
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const flexGrow = use$STATS$Store((s) => s.flexGrowPg1);
  const setFlexGrow = use$STATS$Store((s) => s.setFlexGrowPg1);

  return (
    <Body ref={resizerContainerRef}>
      <Frame style={{ flex: flexGrow }}>
        <StatList1 />
      </Frame>
      <RowResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
      <Frame style={{ flex: 2 - flexGrow }}></Frame>
    </Body>
  );
}

const Body = styled(PageLayout.FrameColumn)`
  padding: 0;
`;
const Frame = styled(PageLayout.FrameColumn)``;

export { PanelPg1 };
