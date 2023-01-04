import styled from "@emotion/styled";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { SMixinFlexColumn } from "@core/styles/emotion";

function FrameDefault() {
  return (
    <PageFrameContainer>
      <React.Suspense fallback={<></>}>
        <Outlet />
      </React.Suspense>
    </PageFrameContainer>
  );
}

export const PageFrameContainer = styled.div`
  ${SMixinFlexColumn("stretch", "stretch")};
  height: 100vh;
  width: 100vw;
  background: ${(p) => p.theme.body_background};
  flex: 1;
`;

export default FrameDefault;
